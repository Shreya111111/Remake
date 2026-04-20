/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UpcyclingProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  materialsNeeded: string[];
  steps: string[];
  estimatedTime: string;
}

export interface ScannedItem {
  name: string;
  material: string;
  condition: string;
  suggestions: UpcyclingProject[];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number | 'Gift';
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  category: string;
  createdAt: number;
}

export interface UserStats {
  itemsScanned: number;
  projectsCompleted: number;
  wasteDivertedKg: number;
}
