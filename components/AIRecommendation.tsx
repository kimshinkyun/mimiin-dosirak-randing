'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePreferenceStore, RecommendationResult } from '@/lib/stores/preference-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CustomerInfoForm from '@/components/CustomerInfoForm'
import { 
  BrainIcon, 
  StarIcon, 
  TrendingUpIcon, 
  HeartIcon,
  SparklesIcon,
  ChefHatIcon,
  ClockIcon,
  UsersIcon,
  RefreshCwIcon,
  DownloadIcon
} from 'lucide-react'

// 인스타그램 링크 상수
const INSTAGRAM_URL = "https://www.instagram.com/mimin.dosirak?utm_source=ig_web_button_share_sheet&igsh=MWtuYzNraHo0cWp4bw=="

// 인스타그램으로 이동하는 함수
const handleInstagramClick = () => {
  window.open(INSTAGRAM_URL, '_blank', 'noopener noreferrer')
}

export default function AIRecommendation() {
  const { 
    preferences, 
    recommendations, 
    isLoading, 
    generateRecommendations,
    addOrderToHistory,
    resetOnboarding // 새로 추가
  } = usePreferenceStore()

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)

  // 컴포넌트 마운트 시 추천 생성
  useEffect(() => {
    if (preferences.onboarding_completed && recommendations.length === 0) {
      generateRecommendations()
    }
  }, [preferences.onboarding_completed])

  // 추천 카테고리별 아이콘과 색상
  const categoryInfo = {
    taste_match: { 
      icon: HeartIcon, 
      color: 'bg-pink-100 text-pink-700 border-pink-200', 
      label: '취향 저격' 
    },
    health_goal: { 
      icon: TrendingUpIcon, 
      color: 'bg-green-100 text-green-700 border-green-200', 
      label: '건강 목표' 
    },
    popular: { 
      icon: UsersIcon, 
      color: 'bg-blue-100 text-blue-700 border-blue-200', 
      label: '인기 메뉴' 
    },
    new_discovery: { 
      icon: SparklesIcon, 
      color: 'bg-purple-100 text-purple-700 border-purple-200', 
      label: '새로운 발견' 
    }
  }

  // 메뉴 주문 - 인스타그램으로 이동하고 AI 학습을 위한 데이터 저장
  const handleOrderMenu = (menuId: string) => {
    // AI 학습을 위한 긍정적 피드백 저장
    const rating = Math.floor(Math.random() * 2) + 4 // 4-5점 랜덤
    addOrderToHistory(menuId, rating)
    
    // 인스타그램으로 이동
    handleInstagramClick()
  }

  // 취향 다시 설정하기
  const handleResetPreferences = () => {
    resetOnboarding()
    setShowOnboarding(true)
  }

  // 온보딩이 완료되지 않은 경우
  if (!preferences.onboarding_completed) {
    return (
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full">
                <BrainIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI가 추천하는<br />당신만의 도시락
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              딱 3분만 투자해 주세요! AI가 당신의 취향을 분석해서<br />
              매일 맞춤형 메뉴를 추천해드릴게요 🤖✨
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: ChefHatIcon, title: '맛 선호도 분석', desc: '매운맛, 단맛 등 5가지 맛 선호도를 분석해요' },
                { icon: TrendingUpIcon, title: '건강 목표 매칭', desc: '다이어트, 근력증가 등 목표에 맞는 영양 구성' },
                { icon: SparklesIcon, title: '학습형 추천', desc: '주문할 때마다 더 정확한 추천을 제공해요' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                >
                  <feature.icon className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => setShowOnboarding(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <BrainIcon className="w-5 h-5 mr-2" />
              AI 추천 시작하기
            </Button>
          </motion.div>
        </div>

        {/* 온보딩 모달 */}
        <AIOnboarding 
          isOpen={showOnboarding} 
          onClose={() => setShowOnboarding(false)} 
        />

        {/* 고객 정보 입력 폼 */}
        <CustomerInfoForm 
          isOpen={showCustomerForm}
          onClose={() => setShowCustomerForm(false)}
        />
      </section>
    )
  }

  // 추천이 있는 경우
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-3">
              <BrainIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI 맞춤 추천
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            당신의 취향을 분석해서 선별한 오늘의 추천 메뉴입니다
          </p>
          <p className="text-sm text-gray-500 mb-6">
            💡 주문하기 버튼을 클릭하면 미미인 도시락 인스타그램으로 이동해서 간편하게 주문하실 수 있어요!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              variant="outline"
              onClick={generateRecommendations}
              disabled={isLoading}
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              {isLoading ? (
                <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCwIcon className="w-4 h-4 mr-2" />
              )}
              다시 추천받기
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResetPreferences}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <BrainIcon className="w-4 h-4 mr-2" />
              취향 다시 설정하기
            </Button>
          </div>

          {/* 맞춤형 도시락 식단보기 버튼 */}
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCustomerForm(true)}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              🍱 맞춤형 도시락 식단보기
            </Button>
          </div>
        </motion.div>

        {/* 로딩 상태 */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 animate-pulse">
                <BrainIcon className="w-8 h-8 text-white animate-pulse" />
              </div>
              <p className="text-lg text-gray-600">AI가 당신의 취향을 분석 중...</p>
              <div className="flex justify-center mt-4">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 추천 메뉴 카드들 */}
        <AnimatePresence>
          {!isLoading && recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.menu.id}
                  recommendation={recommendation}
                  index={index}
                  onOrder={() => handleOrderMenu(recommendation.menu.id)}
                  onViewDietPlan={() => setShowCustomerForm(true)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 추천 없는 경우 */}
        {!isLoading && recommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <SparklesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-4">
              아직 추천할 메뉴를 찾지 못했어요
            </p>
            <Button
              onClick={generateRecommendations}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              다시 추천받기
            </Button>
          </motion.div>
        )}
      </div>

      {/* 고객 정보 입력 폼 */}
      <CustomerInfoForm 
        isOpen={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
      />
    </section>
  )
}

// 개별 추천 카드 컴포넌트
function RecommendationCard({ 
  recommendation, 
  index, 
  onOrder,
  onViewDietPlan
}: { 
  recommendation: RecommendationResult
  index: number
  onOrder: () => void
  onViewDietPlan: () => void
}) {
  const { menu, confidence_score, reason, category } = recommendation
  const { preferences } = usePreferenceStore()
  
  const categoryInfo = {
    taste_match: { 
      icon: HeartIcon, 
      color: 'bg-pink-100 text-pink-700 border-pink-200', 
      label: '취향 저격' 
    },
    health_goal: { 
      icon: TrendingUpIcon, 
      color: 'bg-green-100 text-green-700 border-green-200', 
      label: '건강 목표' 
    },
    popular: { 
      icon: UsersIcon, 
      color: 'bg-blue-100 text-blue-700 border-blue-200', 
      label: '인기 메뉴' 
    },
    new_discovery: { 
      icon: SparklesIcon, 
      color: 'bg-purple-100 text-purple-700 border-purple-200', 
      label: '새로운 발견' 
    }
  }

  const CategoryIcon = categoryInfo[category].icon

  // 목표별 라벨
  const goalLabels = {
    weight_loss: '체중 감량',
    muscle_gain: '근육 증가', 
    healthy_eating: '건강한 식단',
    maintenance: '현재 유지'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform">
        <CardContent className="p-0">
          {/* 메뉴 이미지 및 카테고리 */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
              {menu.image}
            </div>
            
            {/* 카테고리 배지 */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${categoryInfo[category].color}`}>
              <CategoryIcon className="w-3 h-3 inline mr-1" />
              {categoryInfo[category].label}
            </div>

            {/* 신뢰도 점수 */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700">
              <StarIcon className="w-3 h-3 inline mr-1 text-yellow-500 fill-current" />
              {confidence_score}%
            </div>
          </div>

          {/* 메뉴 정보 */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
              ✅ 메뉴: {menu.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {menu.description}
            </p>

            {/* 영양 정보 */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-800">{menu.nutritional_info.calories}</div>
                <div className="text-gray-500">칼로리</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-800">{menu.nutritional_info.protein}g</div>
                <div className="text-gray-500">단백질</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-800">{menu.nutritional_info.sodium}mg</div>
                <div className="text-gray-500">나트륨</div>
              </div>
            </div>

            {/* 추천 이유 */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <BrainIcon className="w-4 h-4 mr-1 text-indigo-500" />
                AI 추천 이유
              </h4>
              <ul className="space-y-1">
                {reason.map((r, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-1 mb-4">
              <span className="text-xs text-gray-600 mr-2">태그:</span>
              {menu.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* 목표별 추천 조합 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                🎯 목표별 추천조합
              </h4>
              <div className="space-y-3">
                {Object.entries(menu.goal_recommendations).map(([goalKey, recommendation]) => {
                  const goalType = goalKey as keyof typeof menu.goal_recommendations
                  return (
                    <div 
                      key={goalKey}
                      className={`p-3 rounded-lg border-l-4 ${
                        recommendation.suitable 
                          ? 'bg-green-50 border-green-400' 
                          : 'bg-red-50 border-red-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-700">
                          ■ {goalLabels[goalType]}
                        </span>
                        {!recommendation.suitable && recommendation.alternative && (
                          <span className="text-xs text-red-600 font-medium">
                            대체: {recommendation.alternative}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">추천 반찬 조합:</span> {recommendation.combination}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">이유:</span> {recommendation.reason}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 주문 버튼 */}
            <div className="flex justify-center">
              <Button
                onClick={onOrder}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-200 w-full"
              >
                📱 주문하기
              </Button>
            </div>

            {/* 맞춤형 도시락 식단보기 버튼 */}
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                onClick={onViewDietPlan}
                className="border-orange-200 text-orange-600 hover:bg-orange-50 w-full"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                📥 맞춤형 식단 다운로드
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// 온보딩 컴포넌트 (간단한 버전)
function AIOnboarding({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { updatePreferences, completeOnboarding } = usePreferenceStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    age_group: null as string | null,
    diet_goal: null as string | null,
    spicy_level: 5,
    korean_preference: 5,
  })

  const steps = [
    {
      title: '연령대를 알려주세요',
      component: (
        <div className="grid grid-cols-2 gap-4">
          {['20s', '30s', '40s', '50s+'].map((age) => (
            <Button
              key={age}
              variant={formData.age_group === age ? 'default' : 'outline'}
              onClick={() => setFormData({ ...formData, age_group: age })}
              className="p-4 h-auto"
            >
              {age}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: '식단 목표가 있나요?',
      component: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'weight_loss', label: '체중 감량' },
            { key: 'muscle_gain', label: '근육 증가' },
            { key: 'healthy_eating', label: '건강한 식단' },
            { key: 'maintenance', label: '현재 유지' }
          ].map((goal) => (
            <Button
              key={goal.key}
              variant={formData.diet_goal === goal.key ? 'default' : 'outline'}
              onClick={() => setFormData({ ...formData, diet_goal: goal.key })}
              className="p-4 h-auto"
            >
              {goal.label}
            </Button>
          ))}
        </div>
      )
    }
  ]

  const handleComplete = () => {
    updatePreferences({
      age_group: formData.age_group as any,
      diet_goal: formData.diet_goal as any,
      taste_preferences: {
        spicy: formData.spicy_level,
        sweet: 5,
        salty: 5,
        sour: 5,
        umami: 5,
      },
      food_categories: {
        korean: formData.korean_preference,
        chinese: 5,
        japanese: 5,
        western: 5,
        healthy: 5,
        comfort: 5,
      }
    })
    completeOnboarding()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <BrainIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {steps[currentStep].title}
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {steps[currentStep].component}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStep > 0 ? () => setCurrentStep(currentStep - 1) : onClose}
          >
            {currentStep > 0 ? '이전' : '건너뛰기'}
          </Button>
          
          <Button
            onClick={currentStep < steps.length - 1 ? () => setCurrentStep(currentStep + 1) : handleComplete}
            className="bg-indigo-500 hover:bg-indigo-600"
            disabled={
              (currentStep === 0 && !formData.age_group) ||
              (currentStep === 1 && !formData.diet_goal)
            }
          >
            {currentStep < steps.length - 1 ? '다음' : '완료'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
} 