"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { 
  Upload, 
  FileCheck2, 
  Trash2, 
  FileText, 
  Sparkles, 
  AlertCircle,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function DocumentOcrPage() {
  const { userId } = useApp();
  
  // OCR Form States
  const [docType, setDocType] = useState("Aadhaar Card");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Verification states
  const [isScanning, setIsScanning] = useState(false);
  const [extractedDetails, setExtractedDetails] = useState<any>(null);
  
  // Document logs
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Missing documents matching schemes (PM Kisan needs Land docs, Ayushman needs Ration, etc.)
  const missingList = [
    { scheme: "PM Kisan", doc: "Land Ownership Documents (Khata/Patta)" },
    { scheme: "Ayushman Bharat", doc: "Ration Card (NFSA)" },
    { scheme: "PM Awas Yojana", doc: "Affidavit of not owning a Pucca House" }
  ];

  useEffect(() => {
    async function loadDocuments() {
      setLoading(true);
      try {
        // Fetch files from database/mock
        const res = await fetch("http://localhost:8000/api/documents");
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
        } else {
          // Default mock files
          setDocuments([
            { _id: "doc-1", type: "Aadhaar Card", file_name: "aadhaar_verified.png", extracted_name: "Rajesh Kumar", document_number: "5423 8901 6712", verification_status: "Verified" },
            { _id: "doc-2", type: "PAN Card", file_name: "pan_verified.jpg", extracted_name: "RAJESH KUMAR", document_number: "BPKPK5432R", verification_status: "Verified" }
          ]);
        }
      } catch {
        setDocuments([
          { _id: "doc-1", type: "Aadhaar Card", file_name: "aadhaar_verified.png", extracted_name: "Rajesh Kumar", document_number: "5423 8901 6712", verification_status: "Verified" },
          { _id: "doc-2", type: "PAN Card", file_name: "pan_verified.jpg", extracted_name: "RAJESH KUMAR", document_number: "BPKPK5432R", verification_status: "Verified" }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedDetails(null);
    }
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsScanning(true);
    // Simulate OCR scanning line lag
    setTimeout(async () => {
      try {
        const details = await sahayakApi.verifyDocument(docType, selectedFile);
        setExtractedDetails(details);
        setDocuments(prev => [details, ...prev]);
        
        // Clear file input
        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsScanning(false);
      }
    }, 4000);
  };

  const handleDeleteDoc = async (id: string) => {
    // Filter local view
    setDocuments(prev => prev.filter(d => d._id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">
      
      {/* LEFT COLUMN: FILE UPLOADER & OCR OUTPUT */}
      <div className="flex-1 space-y-6">
        
        {/* Upload portal */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <Cpu className="w-5 h-5 text-primary mr-1.5" />
            Tesseract OCR Verification
          </h2>

          <form onSubmit={handleScanSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Income Certificate">Income Certificate</option>
                  <option value="Ration Card">Ration Card</option>
                  <option value="Bank Passbook">Bank Passbook</option>
                  <option value="Caste Certificate">Caste Certificate</option>
                  <option value="Disability Certificate">Disability Certificate</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="w-full cursor-pointer flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl py-2 px-3 transition-colors text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <Upload className="w-4 h-4 mr-2 text-slate-400" />
                  Select File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Preview image */}
            {previewUrl && (
              <div className="relative border border-slate-200/50 dark:border-slate-800/40 rounded-2xl overflow-hidden max-h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <img 
                  src={previewUrl} 
                  alt="document preview" 
                  className="object-contain max-h-48"
                />
                {isScanning && (
                  /* Laser Scanning Line Animation */
                  <div className="absolute inset-x-0 h-1 saffron-gradient animate-bounce top-0 shadow-lg shadow-saffron"></div>
                )}
              </div>
            )}

            {selectedFile && (
              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-3 rounded-xl blue-gradient text-white font-bold text-xs shadow-md flex items-center justify-center"
              >
                {isScanning ? (
                  <>
                    <RefreshIcon className="animate-spin w-4 h-4 mr-2" />
                    Extracting Document details...
                  </>
                ) : (
                  <>
                    Run OCR Pre-verification
                  </>
                )}
              </button>
            )}
          </form>
        </div>

        {/* OCR EXTRACTION OUTPUT */}
        {extractedDetails && (
          <div className="bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800/40 p-6 rounded-3xl shadow-premium space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 flex items-center">
                <Sparkles className="w-4 h-4 text-green mr-1.5" />
                OCR Extracted Values
              </h3>
              <span className="text-[10px] bg-green/10 text-green font-bold px-2 py-0.5 rounded-full">
                Confidence: {Math.round(extractedDetails.confidence * 100)}%
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Extracted Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                  {extractedDetails.extracted_name || "Not Found"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Number</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                  {extractedDetails.document_number || "Not Found"}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Address</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 mt-1 block leading-relaxed">
                  {extractedDetails.extracted_address || "Not Found"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                  {extractedDetails.extracted_dob || "Not Found"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Status</span>
                <span className="inline-block mt-1 bg-green/10 text-green font-bold text-[9px] px-2.5 py-0.5 rounded-full">
                  {extractedDetails.verification_status}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN: VERIFIED DOCUMENTS & MISSING CHECKS */}
      <div className="w-full lg:w-[380px] xl:w-[440px] space-y-6">
        
        {/* Verified documents list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
            Verified Vault Documents ({documents.length})
          </h3>

          <div className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <div className="h-12 skeleton rounded-xl animate-pulse"></div>
                <div className="h-12 skeleton rounded-xl animate-pulse"></div>
              </div>
            ) : documents.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">No verified documents. Upload Aadhaar/PAN files to get started.</p>
            ) : (
              documents.map((doc) => (
                <div 
                  key={doc._id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/30 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{doc.type}</h4>
                      <p className="text-[9px] text-slate-400 truncate">{doc.file_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[8px] bg-green/10 text-green font-bold px-2 py-0.5 rounded-full">
                      {doc.verification_status}
                    </span>
                    <button 
                      onClick={() => handleDeleteDoc(doc._id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missing checklist panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center">
            <AlertCircle className="w-4 h-4 text-saffron mr-1.5" />
            Missing Schemes Documents
          </h3>

          <div className="space-y-3">
            {missingList.map((m, idx) => {
              // check if user already has this document type in vault
              const hasDoc = documents.some(d => d.type.toLowerCase().includes(m.doc.split(" ")[0].toLowerCase()));
              if (hasDoc) return null;

              return (
                <div key={idx} className="p-3 bg-red-500/5 border border-red-500/10 rounded-2xl text-[10px] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-red-500">{m.scheme} Requires:</span>
                    <span className="text-[8px] bg-red-500/10 text-red-500 font-bold px-1.5 py-0.5 rounded">Required</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold">{m.doc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );
}
