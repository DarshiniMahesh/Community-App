'use client';
import { useState } from 'react';
import { SANGHA_LIST, Sangha } from '@/data/mockData';
import Modal from '@/components/Modal';
import { IC } from '@/components/Icons';

/* ── Tab definition ── */
type EditTab = 'personal' | 'location' | 'economic' | 'review';

const TABS: { id: EditTab; label: string }[] = [
  { id: 'personal', label: 'Personal' },
  { id: 'location', label: 'Location' },
  { id: 'economic', label: 'Economic' },
  { id: 'review',   label: 'Review'   },
];

/* ── Edit form shape ── */
interface EditForm {
  name: string;
  email: string;
  phone: string;
  currentCity: string;
  currentState: string;
  currentPincode: string;
  income: number;
  assets: string;
  bpl: boolean;
}

const initForm = (s: Sangha): EditForm => ({
  name:           s.name,
  email:          s.email,
  phone:          s.phone,
  currentCity:    s.city    ?? '',
  currentState:   s.state   ?? '',
  currentPincode: s.pincode ?? '',
  income:         s.income  ?? 0,
  assets:         s.assets  ?? '',
  bpl:            s.bpl     ?? false,
});

/* ══════════════════════════════════════════════════════════════ */
export default function SanghaPage() {
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState<Sangha | null>(null);
  const [editModal, setEditModal] = useState<Sangha | null>(null);
  const [editTab, setEditTab]     = useState<EditTab>('personal');
  const [editForm, setEditForm]   = useState<EditForm>(initForm(SANGHA_LIST[0]));

  const list = SANGHA_LIST.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)
  );

  const openEdit = (s: Sangha) => {
    setEditForm(initForm(s));
    setEditTab('personal');
    setEditModal(s);
  };

  const set = (key: keyof EditForm, value: string | number | boolean) =>
    setEditForm(prev => ({ ...prev, [key]: value }));

  const currentTabIndex = TABS.findIndex(t => t.id === editTab);

  /* ── Review rows ── */
  const reviewRows: [string, string][] = editModal ? [
    ['Name',          editForm.name],
    ['Email',         editForm.email],
    ['Phone',         editForm.phone],
    ['City',          editForm.currentCity    || '—'],
    ['State',         editForm.currentState   || '—'],
    ['Pincode',       editForm.currentPincode || '—'],
    ['Annual Income', `Rs.${Number(editForm.income).toLocaleString()}`],
    ['Assets',        editForm.assets || '—'],
    ['BPL',           editForm.bpl ? 'Yes' : 'No'],
  ] : [];

  return (
    <div className="page">
      <div className="page-header"><h1>Sangha Management</h1></div>

      <div className="total-chip">
        <div className="total-chip-val" style={{ color: 'var(--purple)' }}>{SANGHA_LIST.length}</div>
        <div className="total-chip-label">Total Approved Sangha</div>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{IC.search}</span>
          <input placeholder="Search Sangha..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-secondary btn-sm">Export</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id}>
                <td><span className="chip">{s.id}</span></td>
                <td><div className="avatar-cell"><div className="avatar-sm avatar-purple">{s.name[0]}</div>{s.name}</div></td>
                <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{s.email}</td>
                <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{s.phone}</td>
                <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>{s.joined}</td>
                <td>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button className="icon-btn" title="See Info" onClick={() => setModal(s)}>
                      <span style={{ width: 15, height: 15, display: 'inline-flex' }}>{IC.eye}</span>
                    </button>
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(s)}>
                      <span style={{ width: 15, height: 15, display: 'inline-flex' }}>{IC.edit}</span>
                    </button>
                    <button className="icon-btn" title="Export">
                      <span style={{ width: 15, height: 15, display: 'inline-flex' }}>{IC.download}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No Sangha found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── View Info Modal ── */}
      {modal && (
        <Modal open title={`Sangha Info — ${modal.id}`} onClose={() => setModal(null)}
          footer={<button className="btn btn-secondary" onClick={() => setModal(null)}>Close</button>}>
          {([
            ['ID',     modal.id],
            ['Name',   modal.name],
            ['Email',  modal.email],
            ['Phone',  modal.phone],
            ['Joined', modal.joined],
          ] as [string, string][]).map(([k, v]) => (
            <div className="info-row" key={k}>
              <span className="info-key">{k}</span>
              <span className="info-val">{v}</span>
            </div>
          ))}
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editModal && (
        <Modal
          open
          title={`Edit Sangha — ${editModal.id}`}
          onClose={() => setEditModal(null)}
          footer={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentTabIndex === 0}
                  onClick={() => setEditTab(TABS[currentTabIndex - 1].id)}
                >← Prev</button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentTabIndex === TABS.length - 1}
                  onClick={() => setEditTab(TABS[currentTabIndex + 1].id)}
                >Next →</button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={() => setEditModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setEditModal(null)}>Save Changes</button>
              </div>
            </div>
          }
        >
          {/* ── Tab Bar ── */}
          <div style={{
            display: 'flex',
            borderBottom: '1.5px solid var(--gray-200)',
            marginBottom: 20,
            overflowX: 'auto',
            flexShrink: 0,
          }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setEditTab(tab.id)}
                style={{
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: editTab === tab.id ? 600 : 400,
                  color: editTab === tab.id ? 'var(--blue)' : 'var(--gray-400)',
                  background: 'none',
                  border: 'none',
                  borderBottom: editTab === tab.id ? '2.5px solid var(--blue)' : '2.5px solid transparent',
                  marginBottom: -1.5,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══ Tab: Personal ══ */}
          {editTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionLabel>Basic Information</SectionLabel>
              <Row2>
                <EF label="Full Name *" value={editForm.name}  onChange={v => set('name', v)} />
                <EF label="Email *" type="email" value={editForm.email} onChange={v => set('email', v)} />
              </Row2>
              <EF label="Phone" value={editForm.phone} onChange={v => set('phone', v)} />
            </div>
          )}

          {/* ══ Tab: Location ══ */}
          {editTab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionLabel>Address</SectionLabel>
              <Row2>
                <EF label="City *"  value={editForm.currentCity}  onChange={v => set('currentCity', v)} />
                <EF label="State *" value={editForm.currentState} onChange={v => set('currentState', v)} />
              </Row2>
              <EF label="Pincode *" value={editForm.currentPincode} onChange={v => set('currentPincode', v)} />
            </div>
          )}

          {/* ══ Tab: Economic ══ */}
          {editTab === 'economic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionLabel>Economic Details</SectionLabel>
              <EF label="Annual Income (Rs.) *" type="number" value={String(editForm.income)}
                onChange={v => set('income', Number(v))} />
              <EF label="Assets" value={editForm.assets} onChange={v => set('assets', v)} />
              <EToggle label="BPL (Below Poverty Line)?" checked={editForm.bpl} onChange={v => set('bpl', v)} />
            </div>
          )}

          {/* ══ Tab: Review ══ */}
          {editTab === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <SectionLabel>Summary of Changes</SectionLabel>
              <div style={{ marginTop: 8, border: '1px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden' }}>
                {reviewRows.map(([k, v], i) => (
                  <div key={k} style={{
                    display: 'flex', padding: '9px 14px', fontSize: 12,
                    background: i % 2 === 0 ? 'var(--gray-50, #f9fafb)' : 'var(--white, #fff)',
                    borderBottom: i < reviewRows.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  }}>
                    <span style={{ width: 180, color: 'var(--gray-400)', flexShrink: 0 }}>{k}</span>
                    <span style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 14, fontSize: 12, color: 'var(--gray-400)' }}>
                Review all details above before clicking <strong>Save Changes</strong>.
              </p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Reusable helper components
══════════════════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: 'var(--blue)',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      marginTop: 4, paddingBottom: 4,
      borderBottom: '1px solid var(--gray-100)',
    }}>{children}</div>
  );
}

function Row2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {children}
    </div>
  );
}

function EF({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{
          padding: '7px 10px', borderRadius: 6, border: '1px solid var(--gray-200)',
          fontSize: 13, color: 'var(--gray-700)', background: 'var(--white, #fff)', outline: 'none',
        }} />
    </div>
  );
}

function EToggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderRadius: 8,
      border: '1px solid var(--gray-200)', background: 'var(--gray-50, #f9fafb)',
    }}>
      <span style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 500 }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
          background: checked ? 'var(--blue)' : 'var(--gray-300, #d1d5db)',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}