'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, X, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { noteUploadSchema } from '@/lib/validations/notes';
import { SEMESTERS } from '@/lib/utils';
import type { Subject } from '@/types/database';

export default function UploadNotesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    subject_name: '',
    semester: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSubjects = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('subjects').select('*').order('name');
      setSubjects(data || []);
    };
    fetchSubjects();
  }, []);

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF or DOC/DOCX file');
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const result = noteUploadSchema.safeParse({ ...formData, tags });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Please log in'); return; }

      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('notes')
        .upload(fileName, file);

      if (uploadError) { toast.error('Failed to upload file'); setLoading(false); return; }

      const { data: { publicUrl } } = supabase.storage.from('notes').getPublicUrl(fileName);

      // Get subject name if subject selected
      let subjectName = formData.subject_name;
      if (formData.subject_id) {
        const subject = subjects.find((s) => s.id === formData.subject_id);
        if (subject) subjectName = subject.name;
      }

      // Create note record
      const { error: dbError } = await supabase.from('notes').insert({
        title: formData.title,
        description: formData.description || null,
        subject_id: formData.subject_id || null,
        subject_name: subjectName || null,
        semester: formData.semester,
        file_url: publicUrl,
        file_type: fileExt || 'pdf',
        file_size: file.size,
        tags,
        uploaded_by: user.id,
      });

      if (dbError) { toast.error('Failed to save note'); setLoading(false); return; }

      toast.success('Notes uploaded successfully!');
      router.push('/notes');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/notes" className="inline-flex items-center gap-1.5 text-sm text-campus-text-secondary hover:text-campus-purple mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Notes
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-campus-text mb-1">Upload Notes</h1>
        <p className="text-campus-text-secondary text-sm mb-6">Share study materials with your campus community</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="label">Title *</label>
            <input id="title" type="text" placeholder="e.g., DBMS Complete Notes" value={formData.title} onChange={(e) => updateField('title', e.target.value)} className="input-field" />
            {errors.title && <p className="text-campus-danger text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea id="description" placeholder="Brief description of the notes..." value={formData.description} onChange={(e) => updateField('description', e.target.value)} className="input-field min-h-[100px] resize-y" />
          </div>

          {/* Semester + Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="semester" className="label">Semester *</label>
              <select id="semester" value={formData.semester} onChange={(e) => updateField('semester', parseInt(e.target.value))} className="input-field appearance-none cursor-pointer">
                <option value={0}>Select Semester</option>
                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              {errors.semester && <p className="text-campus-danger text-xs mt-1">{errors.semester}</p>}
            </div>
            <div>
              <label htmlFor="subject" className="label">Subject</label>
              <select id="subject" value={formData.subject_id} onChange={(e) => { updateField('subject_id', e.target.value); const s = subjects.find(s => s.id === e.target.value); if (s) updateField('subject_name', s.name); }} className="input-field appearance-none cursor-pointer">
                <option value="">Select Subject</option>
                {subjects.filter(s => formData.semester === 0 || s.semester === formData.semester).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="badge-purple flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add a tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className="input-field flex-1" />
              <button type="button" onClick={addTag} className="btn-secondary px-3"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="label">File (PDF, DOC, DOCX) * — Max 20MB</label>
            {file ? (
              <div className="flex items-center gap-3 p-4 bg-campus-bg rounded-xl">
                <FileText className="w-8 h-8 text-campus-purple" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-campus-text truncate">{file.name}</p>
                  <p className="text-xs text-campus-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button type="button" onClick={() => setFile(null)} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                  <X className="w-4 h-4 text-campus-text-secondary" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-campus-border rounded-xl cursor-pointer hover:border-campus-purple/50 hover:bg-campus-purple-50 transition-all">
                <Upload className="w-10 h-10 text-campus-text-secondary/50 mb-2" />
                <p className="text-sm text-campus-text-secondary mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-campus-text-secondary/70">PDF, DOC, DOCX up to 20MB</p>
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Notes</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
