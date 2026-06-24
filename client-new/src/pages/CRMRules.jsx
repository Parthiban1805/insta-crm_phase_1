import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { 
 Sparkles, 
 FileText, 
 Plus, 
 Trash2, 
 Copy, 
 Check, 
 AlertCircle,
 Search,
 MessageSquare,
 MessageCircle,
 Activity,
 Zap,
 Info,
 GitCommit,
 ChevronDown,
 CheckCircle2,
 Flame
} from 'lucide-react';
import CustomSelect from '../components/ui/CustomSelect';
import Toggle from '../components/settings/Toggle';
import Button from '../components/ui/Button';
import Checkbox from '../components/ui/Checkbox';
import SettingRow from '../components/settings/SettingRow';
import SettingsGroup from '../components/settings/SettingsGroup';
import ReplyTextarea from '../components/settings/ReplyTextarea';

function TargetPostsDropdown({ posts, selectedIds, onChange }) {
 const [isOpen, setIsOpen] = useState(false);
 const dropdownRef = useRef(null);

 useEffect(() => {
 const handleClickOutside = (event) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
 setIsOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const togglePost = (id) => {
 if (selectedIds.includes(id)) {
 onChange(selectedIds.filter(postId => postId !== id));
 } else {
 onChange([...selectedIds, id]);
 }
 };

 return (
 <div className="relative" ref={dropdownRef}>
 <button 
 type="button"
 onClick={() => setIsOpen(!isOpen)}
 className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] text-xs rounded-lg p-2 text-left flex items-center justify-between focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] hover:border-[var(--color-border-hover)] transition-colors"
 >
 <span>
 {selectedIds.length === 0 
 ? "Any post (No specific posts selected)" 
 : `${selectedIds.length} post${selectedIds.length > 1 ? 's' : ''} selected`}
 </span>
 <ChevronDown size={14} className={`text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
 </button>

 {isOpen && (
 <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-lg max-h-64 overflow-y-auto custom-scrollbar flex flex-col p-1">
 {(!posts || posts.length === 0) && (
 <div className="p-3 text-xs text-[var(--color-text-muted)] text-center">No posts found</div>
 )}
 {(posts || []).map(post => {
 const postId = post.id || post.mediaId;
 const d = new Date(post.timestamp).toLocaleDateString();
 const t = new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
 const desc = post.caption ? post.caption.substring(0, 50) + '...' : 'No description';
 const isSelected = selectedIds.includes(postId);
 return (
  <label key={postId} className="flex items-start gap-3 p-2.5 rounded-md hover:bg-[var(--color-bg-subtle)] cursor-pointer transition-colors group">
  <Checkbox 
  checked={isSelected} 
  onChange={() => togglePost(postId)} 
  className="mt-0.5"
  />
  <div className="flex flex-col">
 <span className="text-xs font-medium text-[var(--color-text-light)]">{d} {t}</span>
 <span className="text-xs text-[var(--color-text-main)] line-clamp-1">{desc}</span>
 </div>
 </label>
 );
 })}
 </div>
 )}
 </div>
 );
}

function InstagramPreview({ text, keywords, placement }) {
 const resolvedText = text ? text.replace(/{username}/g, '@follower_handle') : '';
 const firstKeyword = keywords && keywords.trim() ? keywords.split(',')[0].trim() : 'pricing';

 return (
 <div className="card-panel p-5 bg-[var(--color-bg-card)] border-[var(--color-border-subtle)] relative overflow-hidden flex flex-col transition-colors duration-300">
 <div className="border-b border-[var(--color-border-subtle)] pb-2 mb-4 flex items-center gap-2.5">
 <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xs font-extrabold text-white">
 IG
 </div>
 <div>
 <h4 className="text-xs font-bold text-[var(--color-text-main)]">Instagram Preview</h4>
 <p className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
 {placement === 'comment' ? 'Public Comment Feed' : 'Direct Message (DM)'}
 </p>
 </div>
 </div>
 
 {placement === 'comment' ? (
 <div className="space-y-3 p-3.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-xs leading-normal">
 {/* Follower comment */}
 <div className="flex gap-2.5 items-start">
 <div className="w-6 h-6 rounded-full bg-[var(--color-border-focus)] shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase select-none">
 FH
 </div>
 <div>
 <span className="font-semibold text-[var(--color-text-main)] mr-1.5">@follower_handle</span>
 <span className="text-[var(--color-text-main)] font-normal">
 How much is the {firstKeyword} of this? Is it available?
 </span>
 <div className="flex gap-3 text-xs text-[var(--color-text-light)] mt-1 font-semibold">
 <span>2h</span>
 <span className="cursor-pointer">Reply</span>
 </div>
 </div>
 </div>
 
 {/* Automated reply comment */}
 <div className="flex gap-2.5 items-start pl-6 border-l-2 border-[var(--color-border-subtle)]">
 <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase select-none">
 R
 </div>
 <div className="flex-1 min-w-0">
 <span className="font-semibold text-[var(--color-text-main)] mr-1.5">@your_brand</span>
 <span className="text-[var(--color-text-main)] whitespace-pre-wrap break-words font-normal">
 {resolvedText || <span className="italic text-[var(--color-text-light)]">Type response body to preview...</span>}
 </span>
 <div className="flex gap-3 text-xs text-[var(--color-text-light)] mt-1 font-semibold">
 <span>1m</span>
 <span className="cursor-pointer">Reply</span>
 </div>
 </div>
 </div>
 </div>
 ) : (
 <div className="space-y-3.5 p-3.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-xs leading-normal flex flex-col min-h-[140px] justify-end">
 {/* Follower incoming message */}
 <div className="self-start max-w-[85%] bg-[var(--color-msg-incoming)] text-[var(--color-msg-incoming-text)] px-3.5 py-2.5 rounded-2xl rounded-tl-none font-normal ">
 Hello, can you help me with details regarding {firstKeyword}?
 </div>
 
 {/* Automated reply outgoing message */}
 <div className={`self-end max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tr-none font-normal ${
 resolvedText 
 ? 'bg-[var(--color-primary)] text-white' 
 : 'bg-[var(--color-bg-active)] text-[var(--color-text-light)] italic'
 }`}>
 {resolvedText || 'Type response body to preview...'}
 </div>
 </div>
 )}
  </div>
  );
}

export default function CRMRules({ settings, setSettings, handleSaveSettings, saveStatus, posts }) {
 const { token } = useAuth();
 const [rules, setRules] = useState([]);
 const [loading, setLoading] = useState(true);
 
 // Lead Conversion State
 const [newStepSelections, setNewStepSelections] = useState({});

 const fetchRules = async () => {
 try {
 const res = await fetch('http://localhost:5000/api/rules-templates/rules', {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 const data = await res.json();
 if (res.ok) setRules(data);
 } catch (err) {
 console.error(err);
 }
 };

 useEffect(() => {
 const init = async () => {
 setLoading(true);
 await fetchRules();
 setLoading(false);
 };
 if (token) {
 init();
 }
 }, [token]);

 return (
  <div className="fade-in space-y-6 max-w-6xl mx-auto py-4">
  <div className="border-b border-[var(--color-border-subtle)] pb-3 mb-6">
    <h1 className="text-xl font-bold text-[var(--color-text-main)] tracking-tight">Automation Paths</h1>
    <p className="text-sm text-[var(--color-text-muted)] mt-1">Configure global rules and specific post paths.</p>
  </div>

  {loading ? (
  <div className="py-20 flex justify-center">
  <Spinner className="text-[var(--color-primary)]" />
  </div>
  ) : (
  <div className="fade-in w-full space-y-6 pb-20">
 {/* Global Rules Section */}
 <div className="card-panel p-6 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
 <div className="mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
 <h2 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
 Global Rules
 </h2>
 <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
 Set default replies for all posts. Post-specific automation rules will automatically override these settings.
 </p>
 </div>

 <div className="space-y-6">
 <SettingsGroup>
 <SettingRow
 icon={<MessageSquare size={20} />}
 title="Global comment auto-reply"
 description="Automatically respond to any new comment on posts without specific rules"
 enabled={settings?.autoCommentReply}
 onToggle={(val) => setSettings({ ...settings, autoCommentReply: val })}
 />
 {settings?.autoCommentReply && (
 <ReplyTextarea
 value={settings?.commentReplyText || ''}
 onChange={(v) => setSettings({ ...settings, commentReplyText: v })}
 placeholder="Use {username} to tag the commenter…"
 hint="Tip: {username} will be replaced with their Instagram handle"
 />
 )}
 </SettingsGroup>

 <SettingsGroup>
 <SettingRow
 icon={<MessageCircle size={20} />}
 title="Global DM auto-reply"
 description="Send an instant reply to any incoming messages"
 enabled={settings?.autoDMReply}
 onToggle={(val) => setSettings({ ...settings, autoDMReply: val })}
 />
 {settings?.autoDMReply && (
 <ReplyTextarea
 value={settings?.dmReplyText || ''}
 onChange={(v) => setSettings({ ...settings, dmReplyText: v })}
 placeholder="Type your automated DM response…"
 />
 )}
 </SettingsGroup>

 <SettingsGroup>
 <SettingRow
 icon={<Activity size={20} />}
 title="DM on global comment received"
 description="Send a private DM to anyone who triggers the global comment rule"
 enabled={settings?.dmOnComment}
 onToggle={(val) => setSettings({ ...settings, dmOnComment: val })}
 />
 {settings?.dmOnComment && (
 <ReplyTextarea
 value={settings?.dmOnCommentText || ''}
 onChange={(v) => setSettings({ ...settings, dmOnCommentText: v })}
 placeholder="Type the DM to send to commenters…"
 />
 )}
 </SettingsGroup>

 <div className="pt-6 mt-6 border-t border-[var(--color-border-subtle)]">
 <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-4">Fallback Settings</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">Unmatched Comments on Targeted Posts</label>
 <CustomSelect 
 value={settings?.unmatchedCommentFallback || 'none'}
 onChange={(e) => setSettings({ ...settings, unmatchedCommentFallback: e.target.value })}
 options={[
 { value: 'none', label: 'Ignore (Do not reply)' },
 { value: 'global', label: 'Send Global Reply' }
 ]}
 />
 <p className="text-xs text-[var(--color-text-light)] mt-1">If a post has specific rules configured, but the comment doesn't match any keywords, what should happen?</p>
 </div>
 <div>
 <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">Unmatched DMs</label>
 <CustomSelect 
 value={settings?.unmatchedDmFallback || 'none'}
 onChange={(e) => setSettings({ ...settings, unmatchedDmFallback: e.target.value })}
 options={[
 { value: 'none', label: 'Ignore (Do not reply)' },
 { value: 'global', label: 'Send Global Reply' }
 ]}
 />
 <p className="text-xs text-[var(--color-text-light)] mt-1">If specific DM rules are active but none match, what should happen?</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Automation Rules Section */}
 <div className="card-panel p-6 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
 <div className="mb-6 pb-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
 <div>
 <h2 className="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-2">
 Post-Specific Automation Rules
 </h2>
 <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
 Define automated replies and conversion paths based on user interactions on specific posts.
 </p>
 </div>
 <Toggle 
 enabled={settings?.leadConversionLogic === 'sequence'} 
 onChange={(val) => {
 let newRules = settings?.leadConversionRules || [];
 if (val && newRules.length === 0) {
 newRules = [{ id: Math.random().toString(36).substr(2, 9), isActive: true, sequence: [] }];
 }
 setSettings({ 
 ...settings, 
 leadConversionLogic: val ? 'sequence' : 'immediate',
 leadConversionRules: newRules
 });
 }} 
 />
 </div>

 {settings?.leadConversionLogic === 'sequence' ? (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
 Configured Paths (OR)
 </p>
 <Button
 onClick={() => {
 const newRules = [...(settings?.leadConversionRules || []), { id: Math.random().toString(36).substr(2, 9), isActive: true, sequence: [] }];
 setSettings({ ...settings, leadConversionRules: newRules });
 }}
 variant="secondary"
 size="sm"
 icon={Plus}
 >
 Add New Path
 </Button>
 </div>
 
 {(!settings?.leadConversionRules || settings?.leadConversionRules.length === 0) && (
 <div className="text-sm text-[var(--color-status-error)] bg-[var(--color-status-error-bg)] p-3 rounded-lg border border-[var(--color-status-error)]/30 font-medium">
 You must configure at least one path, otherwise leads will never be created automatically!
 </div>
 )}

 <div className="space-y-4">
 {(settings?.leadConversionRules || []).map((rule, ruleIdx) => (
 <div key={rule.id || ruleIdx} className={`bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-xl transition-opacity ${!rule.isActive ? 'opacity-60' : ''}`}>
 <div className="bg-[var(--color-bg-app)] rounded-t-xl px-4 py-3 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
 <div className="flex items-center gap-3">
 <Toggle 
 enabled={rule.isActive !== false} 
 onChange={(val) => {
 const newRules = [...settings.leadConversionRules];
 newRules[ruleIdx] = { ...newRules[ruleIdx], isActive: val };
 setSettings({ ...settings, leadConversionRules: newRules });
 }} 
 />
 <span className="font-bold text-sm text-[var(--color-text-main)]">Path {ruleIdx + 1}</span>
 <div className="h-4 w-[1px] bg-[var(--color-border-subtle)] mx-1"></div>
 <button
   onClick={() => {
     const newRules = [...settings.leadConversionRules];
     newRules[ruleIdx] = { ...newRules[ruleIdx], isHot: !rule.isHot };
     setSettings({ ...settings, leadConversionRules: newRules });
   }}
   className={`text-xs font-semibold px-2 py-1 rounded border flex items-center gap-1.5 transition-colors ${rule.isHot ? 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error)] border-[var(--color-status-error)]/30 hover:bg-[var(--color-status-error-bg)]/80' : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)] hover:text-[var(--color-text-main)] hover:border-[var(--color-border-focus)]'}`}
 >
   <Flame size={14} className={rule.isHot ? 'text-[var(--color-status-error)]' : 'text-[var(--color-text-light)]'} />
   {rule.isHot ? 'Hot Lead' : 'Normal Lead'}
 </button>
 </div>
 <Button
 onClick={() => {
 const newRules = [...settings.leadConversionRules];
 newRules.splice(ruleIdx, 1);
 setSettings({ ...settings, leadConversionRules: newRules });
 }}
 variant="ghost"
 size="sm"
 icon={Trash2}
 title="Delete this entire path"
 className="text-[var(--color-text-light)] hover:text-[var(--color-status-error)]"
 />
 </div>

 <div className="p-4 space-y-3">
 {(!rule.sequence || rule.sequence.length === 0) && (
 <div className="text-xs text-[var(--color-status-error)] font-medium">
 This path has no steps and will be ignored.
 </div>
 )}
 
 {(rule.sequence || []).map((step, idx) => {
  const stepObj = typeof step === 'string' ? { type: step, keywords: '', postIds: [] } : step;
  return (
    <div key={idx} className="flex flex-col gap-3 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold shrink-0">
            {idx + 1}
          </div>
          <span className="text-sm text-[var(--color-text-main)] font-semibold">
            {stepObj.type === 'comment_received' && 'User comments on a post'}
            {stepObj.type === 'admin_replied_comment' && 'Admin replies to user\'s comment'}
            {stepObj.type === 'dm_received' && 'User sends a Direct Message'}
            {stepObj.type === 'dm_sent' && 'Admin sends a Direct Message'}
          </span>
        </div>
        <Button
          onClick={() => {
            const newRules = [...settings.leadConversionRules];
            newRules[ruleIdx].sequence = [...newRules[ruleIdx].sequence];
            newRules[ruleIdx].sequence.splice(idx, 1);
            setSettings({ ...settings, leadConversionRules: newRules });
          }}
          variant="ghost"
          size="sm"
          icon={Trash2}
          title="Delete this entire path"
          className="text-[var(--color-text-light)] hover:text-[var(--color-status-error)]"
        />
      </div>

      <div className="pl-9 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">Trigger Keywords (Comma separated, Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. price, details, link (comma separated)" 
            className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] text-xs rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] p-2"
            value={stepObj.keywords || ''}
            onChange={(e) => {
              const newRules = [...settings.leadConversionRules];
              const newSeq = [...newRules[ruleIdx].sequence];
              newSeq[idx] = { ...stepObj, keywords: e.target.value };
              newRules[ruleIdx].sequence = newSeq;
              setSettings({ ...settings, leadConversionRules: newRules });
            }}
          />
        </div>

        {(stepObj.type === 'comment_received' || stepObj.type === 'admin_replied_comment') && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[var(--color-text-muted)]">Target Posts (Optional)</label>
              <span className="text-[10px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">{stepObj.postIds?.length || 0} / {posts?.length || 0} Selected</span>
            </div>
            <TargetPostsDropdown 
              posts={posts}
              selectedIds={stepObj.postIds || []}
              onChange={(newSelectedIds) => {
                const newRules = [...settings.leadConversionRules];
                const newSeq = [...newRules[ruleIdx].sequence];
                newSeq[idx] = { ...stepObj, postIds: newSelectedIds };
                newRules[ruleIdx].sequence = newSeq;
                setSettings({ ...settings, leadConversionRules: newRules });
              }}
            />
          </div>
        )}

        {stepObj.type === 'dm_received' && (
          <>
            <div className="pt-2 border-t border-[var(--color-border-subtle)]/50 mt-2">
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">Auto-Response Body (Optional)</label>
              <textarea 
                placeholder="Type a message to reply automatically..." 
                rows={2}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] text-xs rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] p-2 resize-none"
                value={stepObj.autoReplyText || ''}
                onChange={(e) => {
                  const newRules = [...settings.leadConversionRules];
                  const newSeq = [...newRules[ruleIdx].sequence];
                  newSeq[idx] = { ...stepObj, autoReplyText: e.target.value, replyPlacement: 'dm' };
                  newRules[ruleIdx].sequence = newSeq;
                  setSettings({ ...settings, leadConversionRules: newRules });
                }}
              />
            </div>
          </>
        )}

        {stepObj.type === 'comment_received' && (
          <>
            <div className="pt-2 border-t border-[var(--color-border-subtle)]/50 mt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[var(--color-text-muted)]">Public Comment Auto-Response (Optional)</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[var(--color-text-light)]">
                  <input 
                    type="checkbox" 
                    className="pro-checkbox"
                    checked={stepObj.useSameResponse || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const newRules = [...settings.leadConversionRules];
                      const newSeq = [...newRules[ruleIdx].sequence];
                      newSeq[idx] = { 
                        ...stepObj, 
                        useSameResponse: checked,
                        dmAutoReplyText: checked ? (stepObj.autoReplyText || '') : stepObj.dmAutoReplyText
                      };
                      newRules[ruleIdx].sequence = newSeq;
                      setSettings({ ...settings, leadConversionRules: newRules });
                    }}
                  />
                  Use same response for DMs
                </label>
              </div>
              <textarea 
                placeholder="Type a public comment reply..." 
                rows={2}
                className="w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] text-xs rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] p-2 resize-none"
                value={stepObj.autoReplyText || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newRules = [...settings.leadConversionRules];
                  const newSeq = [...newRules[ruleIdx].sequence];
                  const updateObj = { ...stepObj, autoReplyText: val };
                  if (stepObj.useSameResponse) {
                    updateObj.dmAutoReplyText = val;
                  }
                  newSeq[idx] = updateObj;
                  newRules[ruleIdx].sequence = newSeq;
                  setSettings({ ...settings, leadConversionRules: newRules });
                }}
              />
              <p className="text-xs text-[var(--color-text-light)] mt-1 mb-3">Use <strong>{'{username}'}</strong> to tag the commenter.</p>

              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">Private DM Auto-Response (Optional)</label>
              <textarea 
                placeholder="Type a private DM reply..." 
                rows={2}
                disabled={stepObj.useSameResponse}
                className={`w-full border border-[var(--color-border-subtle)] text-[var(--color-text-main)] text-xs rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] p-2 resize-none ${stepObj.useSameResponse ? 'bg-[var(--color-bg-hover)] opacity-70 cursor-not-allowed' : 'bg-[var(--color-bg-subtle)]'}`}
                value={stepObj.dmAutoReplyText || ''}
                onChange={(e) => {
                  const newRules = [...settings.leadConversionRules];
                  const newSeq = [...newRules[ruleIdx].sequence];
                  newSeq[idx] = { ...stepObj, dmAutoReplyText: e.target.value };
                  newRules[ruleIdx].sequence = newSeq;
                  setSettings({ ...settings, leadConversionRules: newRules });
                }}
              />
              <p className="text-xs text-[var(--color-text-light)] mt-1">Sent securely as a Private Reply without Advanced Access.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
})}

 {/* Add step control for this specific rule */}
 <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border-subtle)]/50">
 <CustomSelect 
 value={newStepSelections[ruleIdx] || "comment_received"}
 onChange={(e) => setNewStepSelections({...newStepSelections, [ruleIdx]: e.target.value})}
 options={[
 { value: "comment_received", label: "User comments on a post" },
 { value: "admin_replied_comment", label: "Admin replies to user's comment" },
 { value: "dm_received", label: "User sends a Direct Message" },
 { value: "dm_sent", label: "Admin sends a Direct Message" }
 ]}
 className="flex-1"
 />
 <Button
 onClick={() => {
 const selectedVal = newStepSelections[ruleIdx] || "comment_received";
 const newRules = [...settings.leadConversionRules];
 newRules[ruleIdx].sequence = [...(newRules[ruleIdx].sequence || []), { type: selectedVal, keywords: '', postIds: [] }];
 setSettings({ ...settings, leadConversionRules: newRules });
 }}
 variant="secondary"
 size="sm"
 icon={Plus}
 className="shrink-0"
 >
 Add Step
 </Button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 ) : (
 <div className="text-sm text-[var(--color-text-muted)] leading-relaxed italic border-l-2 border-[var(--color-primary)] pl-3">
 Automation Sequences are disabled. Users will be automatically converted to CRM Leads immediately upon their first interaction, and no custom auto-replies will fire.
 </div>
 )}
 
 {/* Save Button specific to Automation Settings */}
 <div className="mt-8 pt-5 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
 <div className="flex items-center">
 {saveStatus === 'success' && (
 <div className="flex items-center gap-2 text-sm text-[var(--color-status-success)] font-medium fade-in">
 <CheckCircle2 size={16} /> Automation settings saved
 </div>
 )}
 {saveStatus === 'error' && (
 <div className="flex items-center gap-2 text-sm text-[var(--color-status-error)] font-medium fade-in">
 <AlertCircle size={16} /> Failed to save settings
 </div>
 )}
 </div>
 <Button
 onClick={handleSaveSettings}
 disabled={saveStatus === 'saving'}
 loading={saveStatus === 'saving'}
 >
 Save Automation Settings
 </Button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
