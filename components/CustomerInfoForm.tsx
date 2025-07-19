'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCustomerStore } from '@/lib/stores/customer-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  UserIcon, 
  PhoneIcon, 
  MailIcon, 
  DownloadIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react'

// Google Sites URL
const DIET_PLAN_URL = "https://sites.google.com/view/mimiin-dosirak/%ED%99%88"

interface CustomerInfoFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function CustomerInfoForm({ isOpen, onClose }: CustomerInfoFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    privacyAgreed: false,
    marketingAgreed: false
  })
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    privacy: '',
    marketing: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { addCustomer, markDietPlanAccessed } = useCustomerStore()

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      privacy: '',
      marketing: ''
    }

    // 이름 검사
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2글자 이상 입력해주세요.'
    }

    // 전화번호 검사
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.'
    } else if (!phoneRegex.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식으로 입력해주세요. (예: 010-1234-5678)'
    }

    // 이메일 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식으로 입력해주세요.'
    }

    // 개인정보 이용동의 검사
    if (!formData.privacyAgreed) {
      newErrors.privacy = '개인정보 이용 동의가 필요합니다.'
    }

    // 마케팅 동의는 선택사항이므로 유효성 검사에서 제외

    setErrors(newErrors)
    return !newErrors.name && !newErrors.phone && !newErrors.email && !newErrors.privacy
  }

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // 고객 정보 저장
      const customerId = addCustomer({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        privacyAgreed: formData.privacyAgreed,
        marketingAgreed: formData.marketingAgreed
      })

      // 성공 상태로 변경
      setIsSuccess(true)

      // 3초 후 Google Sites로 이동
      setTimeout(() => {
        markDietPlanAccessed(customerId)
        window.open(DIET_PLAN_URL, '_blank', 'noopener noreferrer')
        
        // 폼 초기화 및 닫기
        setFormData({ name: '', phone: '', email: '', privacyAgreed: false, marketingAgreed: false })
        setErrors({ name: '', phone: '', email: '', privacy: '', marketing: '' })
        setIsSuccess(false)
        setIsSubmitting(false)
        onClose()
      }, 2000)

    } catch (error) {
      console.error('고객 정보 저장 실패:', error)
      setIsSubmitting(false)
    }
  }

  // 입력 필드 변경 처리
  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 에러 초기화 처리
    if (field === 'privacyAgreed' && errors.privacy) {
      setErrors(prev => ({ ...prev, privacy: '' }))
    } else if (field === 'marketingAgreed' && errors.marketing) {
      setErrors(prev => ({ ...prev, marketing: '' }))
    } else if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            {/* 헤더 */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <DownloadIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                🍱 맞춤형 도시락 식단보기
              </h3>
              <p className="text-gray-600">
                고객님의 정보를 입력하시면<br />
                전문가가 작성한 식단표를 확인하실 수 있습니다!
              </p>
            </div>

            {/* 성공 상태 */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-green-600 mb-2">
                  등록 완료! 🎉
                </h4>
                <p className="text-gray-600 mb-4">
                  식단표 페이지로 이동 중입니다...
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                </div>
              </motion.div>
            )}

            {/* 폼 */}
            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이름 입력 */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <UserIcon className="w-4 h-4 mr-2 text-orange-500" />
                    이름 *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="홍길동"
                    className={`${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && (
                    <div className="flex items-center mt-1 text-red-500 text-xs">
                      <AlertCircleIcon className="w-3 h-3 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* 전화번호 입력 */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2 text-orange-500" />
                    전화번호 *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="010-1234-5678"
                    className={`${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && (
                    <div className="flex items-center mt-1 text-red-500 text-xs">
                      <AlertCircleIcon className="w-3 h-3 mr-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* 이메일 입력 */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MailIcon className="w-4 h-4 mr-2 text-orange-500" />
                    이메일 *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className={`${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <div className="flex items-center mt-1 text-red-500 text-xs">
                      <AlertCircleIcon className="w-3 h-3 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* 개인정보 이용동의 */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="privacyAgreed"
                    checked={formData.privacyAgreed}
                    onChange={(e) => handleInputChange('privacyAgreed', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="privacyAgreed" className="text-sm text-gray-700">
                    <span className="font-medium text-red-600">(필수)</span> 위 개인정보 수집 및 이용에 동의합니다.
                  </Label>
                </div>
                {errors.privacy && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircleIcon className="w-3 h-3 mr-1" />
                    {errors.privacy}
                  </div>
                )}

                {/* 마케팅 동의 */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="marketingAgreed"
                    checked={formData.marketingAgreed}
                    onChange={(e) => handleInputChange('marketingAgreed', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1"
                  />
                  <Label htmlFor="marketingAgreed" className="text-sm text-gray-700">
                    <span className="font-medium text-blue-600">(선택)</span> 마케팅 정보 수신에 동의합니다.<br />
                    <span className="text-xs text-gray-500">
                      (할인·이벤트·건강식단/보험/지원금 정보 등을 문자, 카카오톡 등으로 안내받습니다)
                    </span>
                  </Label>
                </div>
                {errors.marketing && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircleIcon className="w-3 h-3 mr-1" />
                    {errors.marketing}
                  </div>
                )}

                {/* 개인정보 수집 및 이용 동의서 */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  <div className="text-sm text-gray-700">
                    <h4 className="font-bold text-gray-800 mb-3 text-center">
                      📌 개인정보 수집 및 이용에 대한 동의 안내
                    </h4>
                    
                    <p className="text-xs text-red-600 mb-3 text-center">
                      ※ 아래 항목은 서비스 제공을 위한 필수 동의사항입니다.
                    </p>

                    <div className="space-y-3 text-xs">
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">■ 수집 항목</p>
                        <p>- 이름, 연락처(휴대전화번호), 이메일, 상담요청 내용, 관심 서비스 항목(도시락/보험/정책자금/기업인증 등)</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 mb-1">■ 수집 목적</p>
                        <p>- 맞춤형 도시락 식단 추천 및 관련 이벤트 안내</p>
                        <p>- 보험 보장분석 및 맞춤형 컨설팅 제공</p>
                        <p>- 기업 인증, 정책자금, 정부 지원금 관련 안내 및 상담</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 mb-1">■ 보유 및 이용 기간</p>
                        <p>- 수집일로부터 3년간 보관 후 안전하게 파기됩니다.</p>
                        <p>- 마케팅 수신 동의는 1년 이내 보관되며, 언제든 철회 가능합니다.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 mb-1">■ 제3자 제공</p>
                        <p>- 없음</p>
                        <p className="text-gray-600">※ 단, 고객 요청 시 해당 분야 전문 컨설턴트에게 제한적으로 전달될 수 있습니다.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 mb-1">■ 동의 거부 권리 및 불이익</p>
                        <p>- 귀하는 개인정보 수집 및 마케팅 수신에 대한 동의를 거부할 수 있습니다.</p>
                        <p>- 단, 필수 항목에 대한 동의를 거부하실 경우 서비스 이용이 제한될 수 있습니다.</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 mt-4 pt-3 text-center">
                      <p className="text-xs text-gray-600">
                        📞 개인정보 보호책임자: <span className="font-medium text-gray-800">김신균 (홈페이지 관리자)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        처리 중...
                      </div>
                    ) : (
                      '📥 식단표 받기'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 