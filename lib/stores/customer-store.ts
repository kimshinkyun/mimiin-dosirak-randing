import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 고객 정보 타입 정의
export interface CustomerInfo {
  id: string
  name: string
  phone: string
  email: string
  createdAt: string
  accessedDietPlan: boolean // 식단표 접근 여부
  
  // 동의 정보
  agreements: {
    privacy: boolean      // 개인정보 이용 동의 (필수)
    marketing: boolean    // 광고 마케팅 동의 (선택)
    privacyAgreedAt: string | null    // 개인정보 동의 시각
    marketingAgreedAt: string | null  // 마케팅 동의 시각
  }
}

// 스토어 상태 타입
interface CustomerStore {
  // 상태
  customers: CustomerInfo[]
  
  // 액션
  addCustomer: (customerData: Omit<CustomerInfo, 'id' | 'createdAt' | 'accessedDietPlan' | 'agreements'> & {
    privacyAgreed: boolean
    marketingAgreed: boolean
  }) => string
  getCustomers: () => CustomerInfo[]
  markDietPlanAccessed: (customerId: string) => void
  deleteCustomer: (customerId: string) => void
}

// Zustand 스토어 생성
export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: [],

      // 고객 정보 추가
      addCustomer: (customerData) => {
        const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const newCustomer: CustomerInfo = {
          id: customerId,
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email,
          createdAt: new Date().toISOString(),
          accessedDietPlan: false,
          agreements: {
            privacy: customerData.privacyAgreed,
            marketing: customerData.marketingAgreed,
            privacyAgreedAt: customerData.privacyAgreed ? new Date().toISOString() : null,
            marketingAgreedAt: customerData.marketingAgreed ? new Date().toISOString() : null,
          }
        }

        set((state) => ({
          customers: [...state.customers, newCustomer]
        }))

        return customerId
      },

      // 모든 고객 정보 조회
      getCustomers: () => {
        return get().customers
      },

      // 식단표 접근 표시
      markDietPlanAccessed: (customerId) => {
        set((state) => ({
          customers: state.customers.map(customer =>
            customer.id === customerId
              ? { ...customer, accessedDietPlan: true }
              : customer
          )
        }))
      },

      // 고객 정보 삭제
      deleteCustomer: (customerId) => {
        set((state) => ({
          customers: state.customers.filter(customer => customer.id !== customerId)
        }))
      }
    }),
    {
      name: 'customer-data', // localStorage 키
    }
  )
) 