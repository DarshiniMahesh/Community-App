// src/data/mockData.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  income: number;
  family: number;
  assets: string;
  bpl: boolean;
  status: 'approved' | 'pending' | 'rejected';
  submitted: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectedDate?: string;
  rejectedBy?: string;
}

export interface Sangha {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  /* Location */
  city?: string;
  state?: string;
  pincode?: string;
  /* Economic */
  income?: number;
  assets?: string;
  bpl?: boolean;
  /* Status & Approval */
  status?: 'approved' | 'pending' | 'rejected';
  submitted?: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectedDate?: string;
  rejectedBy?: string;
}

export interface PendingSangha {
  id: string;
  name: string;
  email: string;
  phone: string;
  approvedDate?: string;
  approvedBy?: string;
  rejectedDate?: string;
  rejectedBy?: string;
}

/* ================= USERS ================= */

export let USERS: User[] = [
  // Manually added approvedBy for existing approved users
  { id:'U001', name:'Arjun Sharma', email:'arjun@email.com', phone:'+91 9876500001', state:'Karnataka', income:480000, family:4, assets:'Own Home, Vehicle', bpl:false, status:'approved', submitted:'2025-11-10', approvedDate:'2025-11-12', approvedBy: 'Admin' },
  
  // Pending Users
  { id:'U002', name:'Meena Patel', email:'meena@email.com', phone:'+91 9876500002', state:'Tamil Nadu', income:320000, family:3, assets:'Rented', bpl:false, status:'pending', submitted:'2025-12-01' },
  { id:'U003', name:'Rahul Gupta', email:'rahul@email.com', phone:'+91 9876500003', state:'Delhi', income:750000, family:5, assets:'Own Home, Land', bpl:false, status:'pending', submitted:'2025-12-05' },
  
  // Rejected User
  { id:'U004', name:'Sunita Devi', email:'sunita@email.com', phone:'+91 9876500004', state:'West Bengal', income:210000, family:2, assets:'Rented', bpl:true, status:'rejected', submitted:'2025-11-20', rejectedDate:'2025-11-22', rejectedBy:'Admin' },
  { id:'U005', name:'Vikram Nair', email:'vikram@email.com', phone:'+91 9876500005', state:'Kerala', income:560000, family:4, assets:'Own Home', bpl:false, status:'pending', submitted:'2025-12-08' },

  // APPROVED
  { id:'U006', name:'Amit Verma', email:'amit@email.com', phone:'+91 9876500006', state:'UP', income:450000, family:4, assets:'Own Home', bpl:false, status:'approved', submitted:'2025-11-11', approvedDate:'2025-11-13', approvedBy: 'Dharma Sangha' },
  { id:'U007', name:'Kiran Rao', email:'kiran@email.com', phone:'+91 9876500007', state:'Karnataka', income:300000, family:3, assets:'Rented', bpl:false, status:'approved', submitted:'2025-11-12', approvedDate:'2025-11-14', approvedBy: 'Admin' },
  { id:'U008', name:'Deepak Singh', email:'deepak@email.com', phone:'+91 9876500008', state:'Punjab', income:520000, family:5, assets:'Own Home', bpl:false, status:'approved', submitted:'2025-11-13', approvedDate:'2025-11-15', approvedBy: 'Bodhi Society' },
  { id:'U009', name:'Neha Joshi', email:'neha@email.com', phone:'+91 9876500009', state:'Maharashtra', income:410000, family:3, assets:'Own Home', bpl:false, status:'approved', submitted:'2025-11-14', approvedDate:'2025-11-16', approvedBy: 'Admin' },
  { id:'U010', name:'Rohit Das', email:'rohit@email.com', phone:'+91 9876500010', state:'Odisha', income:380000, family:4, assets:'Rented', bpl:false, status:'approved', submitted:'2025-11-15', approvedDate:'2025-11-17', approvedBy: 'Maitri Trust' },
  
  // PENDING
  { id:'U018', name:'Suresh Naik', email:'suresh@email.com', phone:'+91 9876500018', state:'Goa', income:350000, family:3, assets:'Rented', bpl:false, status:'pending', submitted:'2025-12-02' },

  // REJECTED
  { id:'U030', name:'Ajay Thakur', email:'ajay@email.com', phone:'+91 9876500030', state:'HP', income:200000, family:2, assets:'Rented', bpl:true, status:'rejected', submitted:'2025-11-10', rejectedDate:'2025-11-12', rejectedBy:'sangha' },
];

/* ================= SANGHA ================= */

export let SANGHA_LIST: Sangha[] = [
  // --- APPROVED SANGHAS ---
  { id:'S001', name:'Priya Verma',      email:'priya@sangha.com',  phone:'+91 9876501234', joined:'2024-03-15', city:'Bengaluru',  state:'Karnataka',   pincode:'560001', income:480000, assets:'Own Home',          bpl:false, status: 'approved', submitted: '2024-03-01', approvedDate: '2024-03-15', approvedBy: 'Admin' },
  { id:'S002', name:'Ravi Das',         email:'ravi@sangha.com',   phone:'+91 9876502345', joined:'2024-05-20', city:'Chennai',    state:'Tamil Nadu',  pincode:'600001', income:320000, assets:'Rented',            bpl:false, status: 'approved', submitted: '2024-05-10', approvedDate: '2024-05-20', approvedBy: 'Dharma Sangha' },
  { id:'S003', name:'Anita Singh',      email:'anita@sangha.com',  phone:'+91 9876503456', joined:'2024-01-10', city:'New Delhi',  state:'Delhi',       pincode:'110001', income:550000, assets:'Own Home, Vehicle', bpl:false, status: 'approved', submitted: '2024-01-01', approvedDate: '2024-01-10', approvedBy: 'Admin' },
  { id:'S004', name:'Mohammed Irfan',   email:'irfan@sangha.com',  phone:'+91 9876504567', joined:'2024-07-01', city:'Hyderabad',  state:'Telangana',   pincode:'500001', income:410000, assets:'Own Home',          bpl:false, status: 'approved', submitted: '2024-06-20', approvedDate: '2024-07-01', approvedBy: 'Bodhi Society' },
  { id:'S005', name:'Rekha Krishnan',   email:'rekha@sangha.com',  phone:'+91 9876505678', joined:'2024-09-12', city:'Kochi',      state:'Kerala',      pincode:'682001', income:390000, assets:'Rented',            bpl:false, status: 'approved', submitted: '2024-09-01', approvedDate: '2024-09-12', approvedBy: 'Admin' },

  // --- REJECTED SANGHAS ---
  { id:'S101', name:'Sunrise Trust',     email:'sunrise@sangha.com', phone:'+91 9876510001', joined:'2024-02-10', city:'Mysuru',     state:'Karnataka',   pincode:'570001', income:150000, assets:'Rented',            bpl:true,  status: 'rejected', submitted: '2024-01-15', rejectedDate: '2024-02-10', rejectedBy: 'Admin' },
  { id:'S102', name:'Green Earth Group', email:'green@sangha.com',   phone:'+91 9876510002', joined:'2024-03-15', city:'Hubli',      state:'Karnataka',   pincode:'580001', income:180000, assets:'Rented',            bpl:true,  status: 'rejected', submitted: '2024-03-01', rejectedDate: '2024-03-15', rejectedBy: 'Dharma Sangha' },
  { id:'S103', name:'Jai Hind Sangha',   email:'jaihind@sangha.com', phone:'+91 9876510003', joined:'2024-04-20', city:'Pune',       state:'Maharashtra', pincode:'411001', income:220000, assets:'Small Office',      bpl:false, status: 'rejected', submitted: '2024-04-05', rejectedDate: '2024-04-20', rejectedBy: 'Admin' },
  { id:'S104', name:'Women Power Org',   email:'women@sangha.com',   phone:'+91 9876510004', joined:'2024-05-12', city:'Jaipur',     state:'Rajasthan',   pincode:'302001', income:130000, assets:'None',              bpl:true,  status: 'rejected', submitted: '2024-05-01', rejectedDate: '2024-05-12', rejectedBy: 'Bodhi Society' },
  { id:'S105', name:'Youth Force',       email:'youth@sangha.com',   phone:'+91 9876510005', joined:'2024-06-18', city:'Surat',      state:'Gujarat',     pincode:'395001', income:250000, assets:'Community Hall',    bpl:false, status: 'rejected', submitted: '2024-06-01', rejectedDate: '2024-06-18', rejectedBy: 'Admin' },
  { id:'S106', name:'Helping Hands',     email:'help@sangha.com',    phone:'+91 9876510006', joined:'2024-07-22', city:'Indore',     state:'MP',          pincode:'452001', income:160000, assets:'Rented',            bpl:true,  status: 'rejected', submitted: '2024-07-10', rejectedDate: '2024-07-22', rejectedBy: 'Maitri Trust' },
  { id:'S107', name:'Farmers Union',     email:'farmer@sangha.com',  phone:'+91 9876510007', joined:'2024-08-05', city:'Nashik',     state:'Maharashtra', pincode:'422001', income:190000, assets:'Land',              bpl:false, status: 'rejected', submitted: '2024-07-25', rejectedDate: '2024-08-05', rejectedBy: 'Admin' },
  { id:'S108', name:'City Development',  email:'citydev@sangha.com', phone:'+91 9876510008', joined:'2024-09-10', city:'Vadodara',   state:'Gujarat',     pincode:'390001', income:280000, assets:'Office Building',   bpl:false, status: 'rejected', submitted: '2024-09-01', rejectedDate: '2024-09-10', rejectedBy: 'Seva Mandal' },
];

/* ================= PENDING SANGHAS (FILLED) ================= */

export const PENDING_SANGHA: PendingSangha[] = [
  { id:'PS01', name:'Seva Bharati',         email:'seva@sangha.com',   phone:'+91 9876520001' },
  { id:'PS02', name:'Mahila Shakti Sangha', email:'mahila@sangha.com', phone:'+91 9876520002' },
  { id:'PS03', name:'Yuva Vikas Samiti',    email:'yuva@sangha.com',   phone:'+91 9876520003' },
  { id:'PS04', name:'Guru Nanak Trust',     email:'guru@sangha.com',   phone:'+91 9876520004' },
  { id:'PS05', name:'Vidya Bharati',        email:'vidya@sangha.com',  phone:'+91 9876520005' },
  { id:'PS06', name:'Kisan Seva Samaj',     email:'kisan@sangha.com',  phone:'+91 9876520006' },
  { id:'PS07', name:'Health Care Society',  email:'health@sangha.com', phone:'+91 9876520007' },
  { id:'PS08', name:'Art & Culture Trust',  email:'art@sangha.com',    phone:'+91 9876520008' },
];

/* ================= GLOBAL STORAGE ================= */

export let BLOCKED_USERS: User[] = [];

export let DELETED_USERS: User[] = [];

export let BLOCKED_SANGHA: Sangha[] = [];

export let DELETED_SANGHA: Sangha[] = [];

/* ================= DISPLAY NAME MAPPING ================= */

export const USER_DISPLAY_NAMES: Record<string, string> = {};

export const SANGHA_DISPLAY_NAMES: Record<string, string> = {};