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

    // 마케팅 동의 검사
    if (!formData.marketingAgreed) {
      newErrors.marketing = '마케팅 동의가 필요합니다.'
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.phone && !newErrors.email && !newErrors.privacy && !newErrors.marketing
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
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="privacyAgreed"
                    checked={formData.privacyAgreed}
                    onChange={(e) => handleInputChange('privacyAgreed', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="privacyAgreed" className="text-sm text-gray-700">
                    개인정보 이용 동의 (필수)
                  </Label>
                </div>
                {errors.privacy && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircleIcon className="w-3 h-3 mr-1" />
                    {errors.privacy}
                  </div>
                )}

                {/* 마케팅 동의 */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="marketingAgreed"
                    checked={formData.marketingAgreed}
                    onChange={(e) => handleInputChange('marketingAgreed', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="marketingAgreed" className="text-sm text-gray-700">
                    마케팅 정보 수신 동의 (필수)
                  </Label>
                </div>
                {errors.marketing && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircleIcon className="w-3 h-3 mr-1" />
                    {errors.marketing}
                  </div>
                )}

                {/* 안내 메시지 */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-700">
                      <p className="font-medium mb-2">동의 사항</p>
                      <div className="text-xs space-y-1">
                        <p>• 개인정보는 맞춤형 식단 제공 목적으로만 사용됩니다.</p>
                        <p>• 마케팅 정보 수신에 동의하시면 할인 혜택과 이벤트 정보를 받으실 수 있습니다.</p>
                        <p>• 모든 정보는 안전하게 보관되며 외부에 공유되지 않습니다.</p>
                        <p className="font-medium text-orange-800 mt-2">
                          📋 개인정보 관리책임자: 김신균 (홈페이지 관리자)
                        </p>
                      </div>
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