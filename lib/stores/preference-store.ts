import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 사용자 선호도 타입 정의
export interface UserPreferences {
  // 기본 정보
  age_group: '20s' | '30s' | '40s' | '50s+' | null
  gender: 'male' | 'female' | 'other' | null
  
  // 식단 목표
  diet_goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'healthy_eating' | null
  
  // 맛 선호도 (1-10 스케일)
  taste_preferences: {
    spicy: number      // 매운맛
    sweet: number      // 단맛  
    salty: number      // 짠맛
    sour: number       // 신맛
    umami: number      // 감칠맛
  }
  
  // 음식 카테고리 선호도
  food_categories: {
    korean: number     // 한식
    chinese: number    // 중식
    japanese: number   // 일식
    western: number    // 양식
    healthy: number    // 건강식
    comfort: number    // 가정식
  }
  
  // 식재료 선호도
  ingredients: {
    meat: number       // 육류
    seafood: number    // 해산물
    vegetables: number // 채소
    grains: number     // 곡물
    dairy: number      // 유제품
  }
  
  // 알레르기 및 제한사항
  allergies: string[]
  dietary_restrictions: ('vegetarian' | 'vegan' | 'gluten_free' | 'low_sodium' | 'diabetic')[]
  
  // 이전 주문 기록 (AI 학습용)
  order_history: {
    menu_id: string
    rating: number
    date: string
  }[]
  
  // 선호도 설정 완료 여부
  onboarding_completed: boolean
}

// 목표별 추천 조합 타입
export interface GoalRecommendation {
  combination: string
  reason: string
  suitable: boolean  // 해당 목표에 적합한지 여부
  alternative?: string  // 적합하지 않을 때 대체 메뉴
}

// 메뉴 데이터 타입
export interface MenuItem {
  id: string
  name: string
  description: string
  category: keyof UserPreferences['food_categories']
  ingredients: string[]
  nutritional_info: {
    calories: number
    protein: number
    carbs: number
    fat: number
    sodium: number
  }
  taste_profile: {
    spicy: number
    sweet: number
    salty: number
    sour: number
    umami: number
  }
  price: number
  image: string
  tags: string[]
  popularity_score: number
  goal_recommendations: {
    weight_loss: GoalRecommendation
    muscle_gain: GoalRecommendation
    healthy_eating: GoalRecommendation
    maintenance: GoalRecommendation
  }
}

// 추천 결과 타입
export interface RecommendationResult {
  menu: MenuItem
  confidence_score: number  // 0-100 추천 신뢰도
  reason: string[]         // 추천 이유
  category: 'taste_match' | 'health_goal' | 'popular' | 'new_discovery'
}

// 스토어 상태 타입
interface PreferenceStore {
  // 상태
  preferences: UserPreferences
  recommendations: RecommendationResult[]
  isLoading: boolean
  
  // 액션
  updatePreferences: (updates: Partial<UserPreferences>) => void
  addOrderToHistory: (menu_id: string, rating: number) => void
  generateRecommendations: () => void
  completeOnboarding: () => void
  resetPreferences: () => void
  resetOnboarding: () => void // 새로 추가
}

// 기본 선호도 값
const defaultPreferences: UserPreferences = {
  age_group: null,
  gender: null,
  diet_goal: null,
  taste_preferences: {
    spicy: 5,
    sweet: 5,
    salty: 5,
    sour: 5,
    umami: 5,
  },
  food_categories: {
    korean: 5,
    chinese: 5,
    japanese: 5,
    western: 5,
    healthy: 5,
    comfort: 5,
  },
  ingredients: {
    meat: 5,
    seafood: 5,
    vegetables: 5,
    grains: 5,
    dairy: 5,
  },
  allergies: [],
  dietary_restrictions: [],
  order_history: [],
  onboarding_completed: false,
}

// 액션 타입 정의
interface PreferenceActions {
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void
  completeOnboarding: () => void
  resetOnboarding: () => void // 새로 추가
  generateRecommendations: () => void
  addOrderToHistory: (menu_id: string, rating: number) => void
}

// Zustand 스토어 생성
export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      recommendations: [],
      isLoading: false,

      // 선호도 업데이트
      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates }
        }))
        
        // 선호도 변경 시 자동으로 추천 재생성
        get().generateRecommendations()
      },

      // 주문 기록 추가
      addOrderToHistory: (menu_id, rating) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            order_history: [
              ...state.preferences.order_history,
              {
                menu_id,
                rating,
                date: new Date().toISOString(),
              }
            ]
          }
        }))
        
        // 주문 기록 추가 후 추천 재생성
        get().generateRecommendations()
      },

      // AI 추천 생성
      generateRecommendations: () => {
        set({ isLoading: true })
        
        // 실제 AI 추천 로직 (간단한 규칙 기반으로 시작)
        const { preferences } = get()
        const recommendations = generateAIRecommendations(preferences)
        
        setTimeout(() => {
          set({ 
            recommendations,
            isLoading: false 
          })
        }, 1000) // 실제 AI 처리 시뮬레이션
      },

      // 온보딩 완료
      completeOnboarding: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            onboarding_completed: true
          }
        }))
        get().generateRecommendations()
      },

      // 온보딩 리셋 (새로 추가)
      resetOnboarding: () => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            onboarding_completed: false,
          },
          recommendations: [], // 기존 추천도 초기화
        }))
      },

      // 선호도 초기화
      resetPreferences: () => {
        set({
          preferences: defaultPreferences,
          recommendations: []
        })
      },
    }),
    {
      name: 'user-preferences', // localStorage 키
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
)

// AI 추천 알고리즘 (실제 구현)
function generateAIRecommendations(preferences: UserPreferences): RecommendationResult[] {
  // 메뉴 데이터베이스 (실제로는 API에서 가져올 데이터)
  const menuDatabase: MenuItem[] = [
    {
      id: 'bulgogi',
      name: '불고기',
      description: '부드럽게 양념한 소불고기와 신선한 채소',
      category: 'korean',
      ingredients: ['소불고기', '양파', '당근', '깻잎', '불고기소스'],
      nutritional_info: { calories: 620, protein: 28, carbs: 72, fat: 22, sodium: 890 },
      taste_profile: { spicy: 3, sweet: 6, salty: 7, sour: 1, umami: 9 },
      price: 7000,
      image: '🥩',
      tags: ['한국인 인기', '든든함', '고기'],
      popularity_score: 88,
      goal_recommendations: {
        weight_loss: { 
          combination: '불고기 + 쌈채소 + 미역국 + 현미밥(1/2공기)', 
          reason: '고단백 저지방 조합, 쌈채소로 포만감 상승', 
          suitable: true 
        },
        muscle_gain: { 
          combination: '불고기 + 삶은계란 + 고구마 + 된장국', 
          reason: '고단백(불고기+계란) + 복합탄수화물 공급', 
          suitable: true 
        },
        healthy_eating: { 
          combination: '불고기 + 나물 3종 + 김치 + 잡곡밥', 
          reason: '동물성+식물성 단백질 균형, 발효식품 포함', 
          suitable: true 
        },
        maintenance: { 
          combination: '불고기 + 반찬 2-3가지 + 밥 + 국물', 
          reason: '일반적인 조합으로 부담 없이 유지 가능', 
          suitable: true 
        }
      }
    },
    {
      id: 'grilled_salmon',
      name: '연어구이',
      description: '오메가3 풍부한 연어구이와 구운 채소',
      category: 'healthy',
      ingredients: ['연어', '브로콜리', '고구마', '아스파라거스'],
      nutritional_info: { calories: 480, protein: 32, carbs: 45, fat: 18, sodium: 420 },
      taste_profile: { spicy: 1, sweet: 2, salty: 5, sour: 3, umami: 8 },
      price: 7000,
      image: '🐟',
      tags: ['고단백', '저탄수화물', '오메가3'],
      popularity_score: 78,
      goal_recommendations: {
        weight_loss: { 
          combination: '연어구이 + 브로콜리볶음 + 미역냉국 + 현미밥(1/2공기)', 
          reason: '오메가3 지방산은 지방 연소에 도움, 미역과 브로콜리로 식이섬유 보완', 
          suitable: true 
        },
        muscle_gain: { 
          combination: '연어구이 + 삶은계란 1개 + 고구마 100g + 두부조림', 
          reason: '고단백(연어+계란+두부), 고구마는 운동 전후 탄수화물 공급원', 
          suitable: true 
        },
        healthy_eating: { 
          combination: '연어구이 + 연근조림 + 시금치나물 + 잡곡밥', 
          reason: '불포화지방 + 식이섬유 + 무기질 균형 잡힌 식단', 
          suitable: true 
        },
        maintenance: { 
          combination: '연어구이 + 김치 + 된장국 + 백미밥', 
          reason: '간단하면서도 부담 없는 유지식단', 
          suitable: true 
        }
      }
    },
    {
      id: 'chicken_teriyaki',
      name: '데리야키치킨',
      description: '달콤짭조름한 데리야키 소스의 부드러운 치킨',
      category: 'japanese',
      ingredients: ['닭가슴살', '브로콜리', '당근', '데리야키소스'],
      nutritional_info: { calories: 550, protein: 35, carbs: 65, fat: 14, sodium: 750 },
      taste_profile: { spicy: 2, sweet: 7, salty: 6, sour: 1, umami: 6 },
      price: 7000,
      image: '🍗',
      tags: ['고단백', '인기메뉴', '달콤함'],
      popularity_score: 92,
      goal_recommendations: {
        weight_loss: { 
          combination: '데리야키치킨 + 브로콜리 + 당근볶음 + 현미밥(1/2공기)', 
          reason: '고단백 저지방, 채소로 영양 보완', 
          suitable: true 
        },
        muscle_gain: { 
          combination: '데리야키치킨 + 삶은계란 + 고구마 + 콩나물국', 
          reason: '고단백(닭+계란) + 복합탄수화물로 근육 성장 지원', 
          suitable: true 
        },
        healthy_eating: { 
          combination: '데리야키치킨 + 나물 2종 + 김치 + 잡곡밥', 
          reason: '단백질 + 발효식품 + 식이섬유 균형', 
          suitable: true 
        },
        maintenance: { 
          combination: '데리야키치킨 + 반찬 2가지 + 밥 + 국', 
          reason: '달콤한 맛으로 만족도 높은 일반식단', 
          suitable: true 
        }
      }
    },
    {
      id: 'dongkas',
      name: '돈까스',
      description: '바삭한 돈까스와 신선한 샐러드',
      category: 'western',
      ingredients: ['돈까스', '양배추', '토마토', '돈까스소스'],
      nutritional_info: { calories: 580, protein: 25, carbs: 52, fat: 28, sodium: 720 },
      taste_profile: { spicy: 1, sweet: 5, salty: 6, sour: 3, umami: 5 },
      price: 7000,
      image: '🍖',
      tags: ['바삭함', '인기메뉴', '든든함'],
      popularity_score: 85,
      goal_recommendations: {
        weight_loss: { 
          combination: '❌ 추천 비권장 (튀김, 고지방, 고나트륨)', 
          reason: '대체메뉴 추천: 닭가슴살구이 or 생선조림', 
          suitable: false, 
          alternative: '연어구이 or 생선구이' 
        },
        muscle_gain: { 
          combination: '돈까스 + 삶은계란 + 샐러드(드레싱 없음) + 고구마 100g', 
          reason: '열량 보충 + 단백질+복합탄수 구성', 
          suitable: true 
        },
        healthy_eating: { 
          combination: '돈까스(절반) + 오이무침 + 배추겉절이 + 미역국', 
          reason: '기름기 조절 + 채소로 나트륨 균형', 
          suitable: false, 
          alternative: '생선구이' 
        },
        maintenance: { 
          combination: '돈까스 + 샐러드 + 김치 + 백미밥', 
          reason: '일반적인 조합, 양 조절이 핵심', 
          suitable: true 
        }
      }
    },
    {
      id: 'bibimbap',
      name: '비빔밥',
      description: '신선한 나물과 고슬고슬한 밥',
      category: 'korean',
      ingredients: ['밥', '당근', '시금치', '콩나물', '고사리', '계란', '고추장'],
      nutritional_info: { calories: 520, protein: 18, carbs: 78, fat: 12, sodium: 680 },
      taste_profile: { spicy: 4, sweet: 3, salty: 6, sour: 2, umami: 7 },
      price: 7000,
      image: '🍲',
      tags: ['건강식', '채식 가능', '영양균형'],
      popularity_score: 82,
      goal_recommendations: {
        weight_loss: { 
          combination: '비빔밥 + 미역국 + 오이무침', 
          reason: '다양한 나물로 영양 균형, 낮은 칼로리', 
          suitable: true 
        },
        muscle_gain: { 
          combination: '비빔밥 + 계란후라이 + 닭가슴살 + 된장국', 
          reason: '식물성+동물성 단백질 보강으로 근육 성장', 
          suitable: true 
        },
        healthy_eating: { 
          combination: '비빔밥 + 된장국 + 김치', 
          reason: '발효식품 + 다양한 채소로 완벽한 영양 균형', 
          suitable: true 
        },
        maintenance: { 
          combination: '비빔밥 + 김치 + 국물요리', 
          reason: '한국인이 좋아하는 전통적인 조합', 
          suitable: true 
        }
      }
    },
    {
      id: 'galbi_gui',
      name: '갈비구이',
      description: '달콤한 양념의 돼지갈비구이',
      category: 'korean',
      ingredients: ['돼지갈비', '양파', '마늘', '갈비양념'],
      nutritional_info: { calories: 650, protein: 30, carbs: 45, fat: 35, sodium: 950 },
      taste_profile: { spicy: 4, sweet: 7, salty: 8, sour: 2, umami: 8 },
      price: 7000,
      image: '🍖',
      tags: ['고기', '달콤함', '든든함'],
      popularity_score: 90,
      goal_recommendations: {
        weight_loss: { 
          combination: '❌ 추천 비권장 (고지방, 고나트륨)', 
          reason: '대체메뉴 추천: 닭가슴살구이 or 연어구이', 
          suitable: false, 
          alternative: '연어구이 or 생선구이' 
        },
        muscle_gain: { 
          combination: '갈비구이 + 현미밥 + 계란국 + 김치', 
          reason: '고단백 고칼로리로 근육량 증가에 효과적', 
          suitable: true 
        },
        healthy_eating: { 
          combination: '갈비구이(소량) + 쌈채소 + 된장국 + 나물', 
          reason: '기름기는 쌈채소로 중화, 나물로 영양 보완', 
          suitable: false, 
          alternative: '불고기' 
        },
        maintenance: { 
          combination: '갈비구이 + 쌈채소 + 된장찌개 + 밥', 
          reason: '만족도 높은 조합, 쌈채소로 균형', 
          suitable: true 
        }
      }
    },
    {
      id: 'jeyuk_bokkeum',
      name: '제육볶음',
      description: '매콤달콤한 돼지고기 볶음',
      category: 'korean',
      ingredients: ['돼지고기', '양파', '고추', '고추장', '마늘'],
      nutritional_info: { calories: 580, protein: 26, carbs: 42, fat: 28, sodium: 880 },
      taste_profile: { spicy: 7, sweet: 5, salty: 7, sour: 2, umami: 7 },
      price: 7000,
      image: '🌶️',
      tags: ['매운맛', '한식', '밥도둑'],
      popularity_score: 87,
      goal_recommendations: {
        weight_loss: { 
          combination: '❌ 추천 비권장 (기름, 고나트륨)', 
          reason: '대체메뉴 추천: 닭가슴살볶음 or 두부김치', 
          suitable: false, 
          alternative: '데리야키치킨' 
        },
        muscle_gain: { 
          combination: '제육볶음 + 현미밥 + 계란후라이 + 미역국', 
          reason: '고단백 고칼로리, 매운맛으로 신진대사 촉진', 
          suitable: true 
        },
        healthy_eating: { 
          combination: '제육볶음(소량) + 상추쌈 + 오이무침 + 된장국', 
          reason: '쌈채소로 나트륨 중화, 양 조절 필수', 
          suitable: false, 
          alternative: '불고기' 
        },
        maintenance: { 
          combination: '제육볶음 + 쌈채소 + 김치찌개 + 밥', 
          reason: '매운맛 좋아하는 사람에게 만족도 높은 조합', 
          suitable: true 
        }
      }
    },
    {
      id: 'saengseon_gui',
      name: '생선구이',
      description: '담백한 생선구이와 무나물',
      category: 'healthy',
      ingredients: ['고등어', '무', '미나리', '생강'],
      nutritional_info: { calories: 420, protein: 28, carbs: 35, fat: 18, sodium: 480 },
      taste_profile: { spicy: 2, sweet: 3, salty: 5, sour: 4, umami: 8 },
      price: 7000,
      image: '🐟',
      tags: ['담백함', '건강식', '생선'],
      popularity_score: 75,
      goal_recommendations: {
        weight_loss: { 
          combination: '생선구이 + 오이생채 + 미역줄기볶음 + 두부부침', 
          reason: '고단백 저칼로리 구성, 생채류로 포만감 상승', 
          suitable: true 
        },
        muscle_gain: { 
          combination: '생선구이 + 스크램블에그 + 단호박찜 + 현미밥', 
          reason: '빠르게 흡수되는 단백질과 탄수 조합', 
          suitable: true 
        },
        healthy_eating: { 
          combination: '생선구이 + 콩나물무침 + 쌈채소 + 된장국', 
          reason: '식물성+동물성 단백질 균형, 저염 구성', 
          suitable: true 
        },
        maintenance: { 
          combination: '생선구이 + 김치 + 우엉조림 + 백미밥', 
          reason: '정갈한 구성으로 부담 없이 유지 가능', 
          suitable: true 
        }
      }
    }
  ]

  // AI 추천 알고리즘
  const recommendations: RecommendationResult[] = []

  menuDatabase.forEach(menu => {
    let score = 0
    const reasons: string[] = []

    // 1. 맛 선호도 매칭 (40% 가중치)
    const tasteScore = calculateTasteMatch(preferences.taste_preferences, menu.taste_profile)
    score += tasteScore * 0.4
    if (tasteScore > 70) {
      reasons.push(`당신의 맛 선호도와 ${Math.round(tasteScore)}% 일치해요`)
    }

    // 2. 카테고리 선호도 (30% 가중치)
    const categoryScore = preferences.food_categories[menu.category] * 10
    score += categoryScore * 0.3
    if (categoryScore > 70) {
      reasons.push(`좋아하시는 ${getCategoryName(menu.category)} 메뉴예요`)
    }

    // 3. 영양 목표 매칭 (20% 가중치)
    const nutritionScore = calculateNutritionMatch(preferences.diet_goal, menu.nutritional_info)
    score += nutritionScore * 0.2
    if (nutritionScore > 70) {
      reasons.push(getNutritionReason(preferences.diet_goal, menu))
    }

    // 4. 인기도 (10% 가중치)
    score += menu.popularity_score * 0.1
    if (menu.popularity_score > 85) {
      reasons.push('많은 고객들이 좋아하는 인기 메뉴예요')
    }

    // 5. 알레르기 및 제한사항 확인
    const hasAllergy = preferences.allergies.some(allergy => 
      menu.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(allergy.toLowerCase())
      )
    )
    
    if (hasAllergy) {
      score = 0 // 알레르기 있으면 추천하지 않음
    }

    // 6. 이전 주문 기록 기반 학습
    const orderHistory = preferences.order_history.filter(order => order.menu_id === menu.id)
    if (orderHistory.length > 0) {
      const avgRating = orderHistory.reduce((sum, order) => sum + order.rating, 0) / orderHistory.length
      score += (avgRating - 3) * 10 // 평점에 따른 보정
      
      if (avgRating >= 4) {
        reasons.push('이전에 높은 평점을 주신 메뉴와 비슷해요')
      }
    }

    if (score > 40 && !hasAllergy) { // 임계점 이상만 추천
      recommendations.push({
        menu,
        confidence_score: Math.min(Math.round(score), 100),
        reason: reasons.length > 0 ? reasons : ['새로운 맛을 경험해보세요!'],
        category: determineRecommendationCategory(score, tasteScore, menu.popularity_score)
      })
    }
  })

  // 점수 순으로 정렬하고 상위 3개만 반환
  return recommendations
    .sort((a, b) => b.confidence_score - a.confidence_score)
    .slice(0, 3)
}

// 맛 선호도 매칭 계산
function calculateTasteMatch(userTaste: UserPreferences['taste_preferences'], menuTaste: MenuItem['taste_profile']): number {
  const differences = Object.keys(userTaste).map(key => {
    const tasteKey = key as keyof typeof userTaste
    return Math.abs(userTaste[tasteKey] - menuTaste[tasteKey])
  })
  
  const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length
  return Math.max(0, 100 - (avgDifference * 10)) // 차이가 클수록 점수 낮음
}

// 영양 목표 매칭 계산
function calculateNutritionMatch(goal: UserPreferences['diet_goal'], nutrition: MenuItem['nutritional_info']): number {
  switch (goal) {
    case 'weight_loss':
      return nutrition.calories < 500 ? 90 : nutrition.calories < 600 ? 70 : 40
    case 'muscle_gain':
      return nutrition.protein > 25 ? 90 : nutrition.protein > 20 ? 70 : 40
    case 'healthy_eating':
      return nutrition.sodium < 600 && nutrition.protein > 15 ? 90 : 60
    default:
      return 60 // 목표 없으면 기본 점수
  }
}

// 카테고리 이름 반환
function getCategoryName(category: string): string {
  const names: { [key: string]: string } = {
    korean: '한식',
    chinese: '중식', 
    japanese: '일식',
    western: '양식',
    healthy: '건강식',
    comfort: '가정식'
  }
  return names[category] || category
}

// 영양 추천 이유 반환
function getNutritionReason(goal: UserPreferences['diet_goal'], menu: MenuItem): string {
  switch (goal) {
    case 'weight_loss':
      return `다이어트에 좋은 ${menu.nutritional_info.calories}kcal 저칼로리 메뉴예요`
    case 'muscle_gain':
      return `근육 성장에 도움되는 고단백(${menu.nutritional_info.protein}g) 메뉴예요`
    case 'healthy_eating':
      return '영양 균형이 잘 맞춰진 건강한 메뉴예요'
    default:
      return '영양가가 풍부한 메뉴예요'
  }
}

// 추천 카테고리 결정
function determineRecommendationCategory(
  totalScore: number, 
  tasteScore: number, 
  popularityScore: number
): RecommendationResult['category'] {
  if (tasteScore > 80) return 'taste_match'
  if (popularityScore > 85) return 'popular'
  if (totalScore > 80) return 'health_goal'
  return 'new_discovery'
} 