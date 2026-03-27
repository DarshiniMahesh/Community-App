'use client';
import { useState } from 'react';
import { USERS, User } from '@/data/mockData';
import Modal from '@/components/Modal';
import { IC } from '@/components/Icons';

/* ── Tab definition ── */
type EditTab = 'personal' | 'religious' | 'family' | 'location' | 'education' | 'economic' | 'review';

const TABS: { id: EditTab; label: string }[] = [
  { id: 'personal',  label: 'Personal'  },
  { id: 'religious', label: 'Religious' },
  { id: 'family',    label: 'Family'    },
  { id: 'location',  label: 'Location'  },
  { id: 'education', label: 'Education' },
  { id: 'economic',  label: 'Economic'  },
  { id: 'review',    label: 'Review'    },
];

/* ── Extended edit-form shape (superset of User + all profile step fields) ── */
interface EditForm {
  /* Step 1 – Personal */
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  isMarried: boolean;
  spouseName: string;
  fathersName: string;
  mothersName: string;
  surnameInUse: string;
  /* Step 2 – Religious */
  gotra: string;
  pravara: string;
  upanama: string;
  kuladevata: string;
  surnameAsPerGotra: string;
  priestName: string;
  priestLocation: string;
  /* Step 3 – Family */
  familyType: string;
  familyMembersCount: string;
  /* Step 4 – Location */
  currentCity: string;
  currentState: string;
  currentPincode: string;
  hometownCity: string;
  hometownState: string;
  /* Step 5 – Education */
  highestQualification: string;
  institution: string;
  occupation: string;
  employer: string;
  annualIncome: string;
  /* Step 6 – Economic (maps back to User) */
  income: number;
  assets: string;
  bpl: boolean;
  state: string;
  family: number;
}

const initForm = (u: User): EditForm => ({
  name: u.name,           email: u.email,           phone: u.phone,
  gender: '',             dateOfBirth: '',           isMarried: false,
  spouseName: '',         fathersName: '',           mothersName: '',
  surnameInUse: '',
  gotra: '',              pravara: '',               upanama: '',
  kuladevata: '',         surnameAsPerGotra: '',     priestName: '',
  priestLocation: '',
  familyType: '',         familyMembersCount: String(u.family),
  currentCity: u.state,  currentState: u.state,     currentPincode: '',
  hometownCity: '',       hometownState: '',
  highestQualification: '', institution: '',         occupation: '',
  employer: '',           annualIncome: String(u.income),
  income: u.income,       assets: u.assets,          bpl: u.bpl,
  state: u.state,         family: u.family,
});

/* ══════════════════════════════════════════════════════════════ */
export default function UsersPage() {
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState<User | null>(null);
  const [editModal, setEditModal] = useState<User | null>(null);
  const [editTab, setEditTab]     = useState<EditTab>('personal');
  const [editForm, setEditForm]   = useState<EditForm>(initForm(USERS[0]));

  const list = USERS.filter(u =>
    u.status === 'approved' &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search))
  );

  const openEdit = (u: User) => {
    setEditForm(initForm(u));
    setEditTab('personal');
    setEditModal(u);
  };

  const set = (key: keyof EditForm, value: string | number | boolean) =>
    setEditForm(prev => ({ ...prev, [key]: value }));

  const currentTabIndex = TABS.findIndex(t => t.id === editTab);

  /* ── Review summary rows ── */
  const reviewRows: [string, string][] = editModal ? [
    ['Name',                editForm.name],
    ['Email',               editForm.email],
    ['Phone',               editForm.phone],
    ['Gender',              editForm.gender || '—'],
    ['Date of Birth',       editForm.dateOfBirth || '—'],
    ['Married',             editForm.isMarried ? 'Yes' : 'No'],
    ['Spouse',              editForm.spouseName || '—'],
    ['Father',              editForm.fathersName || '—'],
    ['Mother',              editForm.mothersName || '—'],
    ['Gotra',               editForm.gotra || '—'],
    ['Pravara',             editForm.pravara || '—'],
    ['Upanama',             editForm.upanama || '—'],
    ['Kuladevata',          editForm.kuladevata || '—'],
    ['Priest Name',         editForm.priestName || '—'],
    ['Priest Location',     editForm.priestLocation || '—'],
    ['Family Type',         editForm.familyType || '—'],
    ['Family Members',      editForm.familyMembersCount],
    ['Current City',        editForm.currentCity || '—'],
    ['Current State',       editForm.currentState || '—'],
    ['Current Pincode',     editForm.currentPincode || '—'],
    ['Hometown City',       editForm.hometownCity || '—'],
    ['Hometown State',      editForm.hometownState || '—'],
    ['Qualification',       editForm.highestQualification || '—'],
    ['Institution',         editForm.institution || '—'],
    ['Occupation',          editForm.occupation || '—'],
    ['Employer',            editForm.employer || '—'],
    ['Annual Income',       `Rs.${Number(editForm.annualIncome || editForm.income).toLocaleString()}`],
    ['Assets',              editForm.assets],
    ['BPL',                 editForm.bpl ? 'Yes' : 'No'],
  ] : [];

  return (
    <div className="page">
      <div className="page-header"><h1>User Management</h1></div>

      <div className="total-chip">
        <div className="total-chip-val" style={{ color: 'var(--blue)' }}>
          {USERS.filter(u => u.status === 'approved').length}
        </div>
        <div className="total-chip-label">Total Approved Users</div>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{IC.search}</span>
          <input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-secondary btn-sm">Export</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Submitted</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {list.map(u => (
              <tr key={u.id}>
                <td><span className="chip">{u.id}</span></td>
                <td><div className="avatar-cell"><div className="avatar-sm">{u.name[0]}</div>{u.name}</div></td>
                <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{u.email}</td>
                <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{u.phone}</td>
                <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>{u.submitted}</td>
                <td>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button className="icon-btn" title="See Info" onClick={() => setModal(u)}>
                      <span style={{ width: 15, height: 15, display: 'inline-flex' }}>{IC.eye}</span>
                    </button>
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(u)}>
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
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── View Info Modal ── */}
      {modal && (
        <Modal open title={`User Info — ${modal.id}`} onClose={() => setModal(null)}
          footer={<button className="btn btn-secondary" onClick={() => setModal(null)}>Close</button>}>

          {/* ── Basic ── */}
          <InfoSection label="Basic Information" />
          {([
            ['ID',     modal.id],
            ['Name',   modal.name],
            ['Email',  modal.email],
            ['Phone',  modal.phone],
            ['Status', modal.status],
          ] as [string, string][]).map(([k, v]) => (
            <div className="info-row" key={k}>
              <span className="info-key">{k}</span>
              <span className="info-val">{v}</span>
            </div>
          ))}

          {/* ── Economic ── */}
          <InfoSection label="Economic Details" />
          {([
            ['Annual Income',   `Rs.${modal.income.toLocaleString()}`],
            ['Family Members',  String(modal.family)],
            ['Assets',          modal.assets],
            ['BPL',             modal.bpl ? 'Yes' : 'No'],
            ['State',           modal.state],
          ] as [string, string][]).map(([k, v]) => (
            <div className="info-row" key={k}>
              <span className="info-key">{k}</span>
              <span className="info-val">{v}</span>
            </div>
          ))}

          {/* ── Application ── */}
          <InfoSection label="Application" />
          {([
            ['Submitted',    modal.submitted],
            ['Approved On',  modal.approvedDate  ?? '—'],
            ['Rejected On',  modal.rejectedDate  ?? '—'],
            ['Rejected By',  modal.rejectedBy    ?? '—'],
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
          title={`Edit User — ${editModal.id}`}
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
                <EF label="Full Name *"    value={editForm.name}        onChange={v => set('name', v)} />
                <EF label="Email *"        type="email" value={editForm.email}       onChange={v => set('email', v)} />
              </Row2>
              <Row2>
                <EF label="Phone"          value={editForm.phone}       onChange={v => set('phone', v)} />
                <EF label="Date of Birth"  type="date" value={editForm.dateOfBirth}  onChange={v => set('dateOfBirth', v)} />
              </Row2>
              <Row2>
                <EF label="Surname in Use" value={editForm.surnameInUse} onChange={v => set('surnameInUse', v)} />
                <ESelect label="Gender *" value={editForm.gender} onChange={v => set('gender', v)}
                  options={[{ v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }, { v: 'other', l: 'Other' }]} />
              </Row2>
              <Row2>
                <EF label="Father's Name"  value={editForm.fathersName} onChange={v => set('fathersName', v)} />
                <EF label="Mother's Name"  value={editForm.mothersName} onChange={v => set('mothersName', v)} />
              </Row2>
              <SectionLabel>Marital Status</SectionLabel>
              <EToggle label="Married?" checked={editForm.isMarried} onChange={v => set('isMarried', v)} />
              {editForm.isMarried && (
                <EF label="Spouse Name *" value={editForm.spouseName} onChange={v => set('spouseName', v)} />
              )}
            </div>
          )}

          {/* ══ Tab: Religious ══ */}
          {editTab === 'religious' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionLabel>Religious Lineage</SectionLabel>
              <Row2>
                <EF label="Gotra *"   value={editForm.gotra}   onChange={v => set('gotra', v)} />
                <EF label="Pravara *" value={editForm.pravara} onChange={v => set('pravara', v)} />
              </Row2>
              <Row2>
                <EF label="Upanama *"    value={editForm.upanama}    onChange={v => set('upanama', v)} />
                <EF label="Kuladevata *" value={editForm.kuladevata} onChange={v => set('kuladevata', v)} />
              </Row2>
              <SectionLabel>Surname & Priest</SectionLabel>
              <Row2>
                <EF label="Surname in Use *"      value={editForm.surnameInUse}      onChange={v => set('surnameInUse', v)} />
                <EF label="Surname (as per Gotra)" value={editForm.surnameAsPerGotra} onChange={v => set('surnameAsPerGotra', v)} />
              </Row2>
              <Row2>
                <EF label="Family Priest Name"    value={editForm.priestName}     onChange={v => set('priestName', v)} />
                <EF label="Priest Location"       value={editForm.priestLocation} onChange={v => set('priestLocation', v)} />
              </Row2>
            </div>
          )}

          {/* ══ Tab: Family ══ */}
          {editTab === 'family' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionLabel>Family Details</SectionLabel>
              <ESelect
                label="Family Type *"
                value={editForm.familyType}
                onChange={v => set('familyType', v)}
                options={[{ v: 'nuclear', l: 'Nuclear Family' }, { v: 'joint', l: 'Joint Family' }]}
              />
              <EF
                label="Number of Family Members"
                type="number"
                value={editForm.familyMembersCount}
                onChange={v => { set('familyMembersCount', v); set('family', Number(v)); }}
              />
              <div style={{
                padding: '12px 14px', background: 'var(--gray-50, #f9fafb)',
                borderRadius: 8, border: '1px solid var(--gray-200)', fontSize: 12, color: 'var(--gray-400)',
              }}>
                ℹ️ Individual family member records (name, age, relation, gender, status) are managed in the user's full profile. This section updates family type and total count.
              </div>
            </div>
          )}

          {/* ══ Tab: Location ══ */}
          {editTab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionLabel>Current Address</SectionLabel>
              <Row2>
                <EF label="City *"    value={editForm.currentCity}    onChange={v => set('currentCity', v)} />
                <EF label="State *"   value={editForm.currentState}   onChange={v => { set('currentState', v); set('state', v); }} />
              </Row2>
              <EF label="Pincode *"   value={editForm.currentPincode} onChange={v => set('currentPincode', v)} />
              <SectionLabel>Hometown Address</SectionLabel>
              <Row2>
                <EF label="Hometown City *"  value={editForm.hometownCity}  onChange={v => set('hometownCity', v)} />
                <EF label="Hometown State *" value={editForm.hometownState} onChange={v => set('hometownState', v)} />
              </Row2>
            </div>
          )}

          {/* ══ Tab: Education ══ */}
          {editTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionLabel>Education</SectionLabel>
              <Row2>
                <EF label="Highest Qualification"    value={editForm.highestQualification} onChange={v => set('highestQualification', v)} />
                <EF label="Institution / University" value={editForm.institution}           onChange={v => set('institution', v)} />
              </Row2>
              <SectionLabel>Profession</SectionLabel>
              <Row2>
                <EF label="Occupation"               value={editForm.occupation} onChange={v => set('occupation', v)} />
                <EF label="Employer / Organisation"  value={editForm.employer}   onChange={v => set('employer', v)} />
              </Row2>
              <EF label="Annual Income (Rs.)" type="number" value={editForm.annualIncome}
                onChange={v => { set('annualIncome', v); set('income', Number(v)); }} />
            </div>
          )}

          {/* ══ Tab: Economic ══ */}
          {editTab === 'economic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionLabel>Economic Details</SectionLabel>
              <EF label="Annual Income (Rs.) *" type="number" value={String(editForm.income)}
                onChange={v => { set('income', Number(v)); set('annualIncome', v); }} />
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

function InfoSection({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: 'var(--blue)',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      margin: '14px 0 4px',
      paddingBottom: 4,
      borderBottom: '1px solid var(--gray-100)',
    }}>{label}</div>
  );
}

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

function ESelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--gray-500)' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          padding: '7px 10px', borderRadius: 6, border: '1px solid var(--gray-200)',
          fontSize: 13, color: 'var(--gray-700)', background: 'var(--white, #fff)', outline: 'none',
        }}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
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
