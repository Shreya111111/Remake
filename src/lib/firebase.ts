/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, getDocs, addDoc, serverTimestamp, orderBy, limit, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserStats, MarketplaceItem, ScannedItem } from '../types';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const logout = () => auth.signOut();

// User Profile Helpers
export const getUserProfile = async (uid: string): Promise<UserStats | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserStats;
  }
  return null;
};

export const createUserProfile = async (user: FirebaseUser) => {
  const userRef = doc(db, 'users', user.uid);
  const initialStats: UserStats = {
    itemsScanned: 0,
    projectsCompleted: 0,
    wasteDivertedKg: 0
  };
  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    ...initialStats,
    updatedAt: serverTimestamp()
  });
  return initialStats;
};

export const updateStats = async (uid: string, stats: Partial<UserStats>) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...stats,
    updatedAt: serverTimestamp()
  });
};

// Marketplace Helpers
export const getMarketplaceItems = async (): Promise<MarketplaceItem[]> => {
  const marketplaceRef = collection(db, 'marketplace');
  const q = query(marketplaceRef, orderBy('createdAt', 'desc'), limit(50));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    const createdAt = data.createdAt?.toMillis?.() ?? Date.now();
    return { id: docSnap.id, ...data, createdAt } as MarketplaceItem;
  });
};

export const createListing = async (item: Omit<MarketplaceItem, 'id' | 'createdAt'>) => {
  const listingRef = collection(db, 'marketplace');
  await addDoc(listingRef, {
    ...item,
    createdAt: serverTimestamp()
  });
};

export const deleteListing = async (id: string) => {
  const listingRef = doc(db, 'marketplace', id);
  await deleteDoc(listingRef);
};

// Scan History Helpers
export const saveScanResult = async (uid: string, item: Omit<ScannedItem, 'suggestions'>) => {
  const scansRef = collection(db, 'users', uid, 'scans');
  await addDoc(scansRef, {
    ...item,
    createdAt: serverTimestamp()
  });
};
