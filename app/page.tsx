"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDownIcon, ChevronUpIcon, MenuIcon, XIcon, PhoneIcon, MapPinIcon, ClockIcon, StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AIRecommendation from "@/components/AIRecommendation"

// 인스타그램 링크 상수
const INSTAGRAM_URL = "https://www.instagram.com/mimin.dosirak?utm_source=ig_web_button_share_sheet&igsh=MWtuYzNraHo0cWp4bw=="

// 스크롤 애니메이션을 위한 커스텀 훅
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isVisible] as const
}

// 인스타그램으로 이동하는 함수
const handleInstagramClick = () => {
  window.open(INSTAGRAM_URL, '_blank', 'noopener noreferrer')
}

export default function LunchboxLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [heroRef, heroVisible] = useScrollAnimation()
  const [featuresRef, featuresVisible] = useScrollAnimation()
  const [problemRef, problemVisible] = useScrollAnimation()
  const [stepsRef, stepsVisible] = useScrollAnimation()
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation()
  const [faqRef, faqVisible] = useScrollAnimation()
  const [ctaRef, ctaVisible] = useScrollAnimation()

  // FAQ 토글 함수
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // 고객 후기 데이터
  const testimonials = [
    {
      name: "김민지",
      company: "IT회사 직장인",
      rating: 5,
      text: "점심이 기다려지는 하루! 반찬도 매일 다르고 정말 맛있어요. 집에서 먹는 것처럼 든든해요.",
      avatar: "👩‍💼",
    },
    {
      name: "박성호",
      company: "제조업 팀장",
      rating: 5,
      text: "회사 전 직원이 단체로 정기구독 중입니다! 직원들 만족도가 정말 높아요.",
      avatar: "👨‍💼",
    },
    {
      name: "이수연",
      company: "금융회사 대리",
      rating: 5,
      text: "건강한 구성이라 다이어트에도 좋고, 배송도 정확해서 믿고 먹고 있어요.",
      avatar: "👩‍🏫",
    },
  ]

  // 자주 묻는 질문 데이터
  const faqs = [
    {
      question: "최소 주문 수량이 있나요?",
      answer: "네, 4개 이상 주문 시 배송이 가능하며, 개인 주문도 환영합니다. 단체 주문 시 할인 혜택도 있어요!",
    },
    {
      question: "배송은 어떤 지역이 가능한가요?",
      answer: "창원, 마산, 진해 지역 배송 가능하며, 기업 단체 주문의 경우 별도 협의를 통해 확장 지역 배송도 가능합니다.",
    },
    {
      question: "메뉴는 고정인가요?",
      answer: "매주 새로운 식단표로 구성되며, 계절 재료를 활용한 다양한 메뉴를 제공합니다. 인스타그램에서 미리 확인하실 수 있어요.",
    },
    {
      question: "결제는 어떻게 하나요?",
      answer: "정기 자동결제 또는 주차별 계좌이체 모두 가능하며, 카드 결제와 현금 결제도 지원합니다.",
    },
  ]

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Noto Sans KR', 'Pretendard', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 1s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 1s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2s infinite;
        }

        .hover-lift {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(255, 145, 77, 0.15);
        }

        .hover-scale {
          transition: all 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.1);
        }

        .hover-glow {
          transition: all 0.3s ease;
        }

        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(255, 145, 77, 0.5);
        }

        .gradient-text {
          background: linear-gradient(135deg, #ff914d, #ff6b35);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-hover {
          transition: all 0.4s ease;
          border: 1px solid #f3f4f6;
        }

        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
          border-color: #ff914d;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.3s; }
        .stagger-3 { animation-delay: 0.5s; }
        .stagger-4 { animation-delay: 0.7s; }
      `}</style>

      {/* 네비게이션 바 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleInstagramClick}>
              <div className="text-2xl">🍱</div>
              <span className="text-xl font-bold gradient-text">미미인 도시락</span>
            </div>

            {/* 데스크톱 메뉴 */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">특징</a>
              <a href="#process" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">이용방법</a>
              <a href="#reviews" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">후기</a>
              <a href="#faq" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">FAQ</a>
              <Button 
                onClick={handleInstagramClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 hover-glow"
              >
                주문하기
              </Button>
            </div>

            {/* 모바일 메뉴 버튼 */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-orange-500 transition-colors"
              >
                {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 bg-white">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors font-medium px-4 py-2">특징</a>
                <a href="#process" className="text-gray-700 hover:text-orange-500 transition-colors font-medium px-4 py-2">이용방법</a>
                <a href="#reviews" className="text-gray-700 hover:text-orange-500 transition-colors font-medium px-4 py-2">후기</a>
                <a href="#faq" className="text-gray-700 hover:text-orange-500 transition-colors font-medium px-4 py-2">FAQ</a>
                <div className="px-4 pt-2">
                  <Button 
                    onClick={handleInstagramClick}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    주문하기
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 overflow-hidden pt-16"
      >
        {/* 배경 장식 요소 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-orange-200/30 animate-pulse-slow"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-orange-300/30 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className={`${heroVisible ? "animate-fadeInUp" : "opacity-0"}`}>
            <div className="text-7xl md:text-8xl mb-6 animate-bounce-slow">🍱</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-gray-800">
              오늘도 <span className="gradient-text">"뭐 먹지?"</span><br />
              고민된다면
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              직장인을 위한 <span className="font-bold text-orange-600">정기 도시락</span><br />
              1끼 <span className="font-bold text-orange-600">7,000원</span>으로 든든하게 해결하세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleInstagramClick}
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-4 hover-glow transition-all duration-300 hover:scale-105 shadow-lg"
            >
                📞 주문 & 문의하기
            </Button>
            <Button
              size="lg"
              onClick={handleInstagramClick}
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white text-lg px-10 py-4 transition-all duration-300 hover:scale-105"
            >
                📸 인스타그램 보기
            </Button>
            </div>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-orange-600 animate-bounce-slow">
          <ChevronDownIcon className="w-8 h-8" />
        </div>
      </section>

      {/* 특징 섹션 */}
      <section id="features" ref={featuresRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 ${featuresVisible ? "animate-fadeInUp" : "opacity-0"}`}
          >
            <span className="gradient-text">미미인 도시락</span>이 특별한 이유
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card
              className={`card-hover p-8 text-center bg-gradient-to-br from-orange-50 to-orange-100 ${featuresVisible ? "animate-scaleIn stagger-1" : "opacity-0"}`}
            >
              <CardContent className="pt-6">
                <div className="text-6xl mb-6 hover-scale cursor-default">🍱</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">정성 가득 집밥 퀄리티</h3>
                <p className="text-gray-600 leading-relaxed">30년 경력 주방장이 직접 만드는<br />건강하고 맛있는 도시락</p>
              </CardContent>
            </Card>
            <Card
              className={`card-hover p-8 text-center bg-gradient-to-br from-green-50 to-green-100 ${featuresVisible ? "animate-scaleIn stagger-2" : "opacity-0"}`}
            >
              <CardContent className="pt-6">
                <div className="text-6xl mb-6 hover-scale cursor-default">📦</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">깔끔한 포장 & 다양한 메뉴</h3>
                <p className="text-gray-600 leading-relaxed">점심/저녁 선택 가능<br />주 3~5회 맞춤 배송</p>
              </CardContent>
            </Card>
            <Card
              className={`card-hover p-8 text-center bg-gradient-to-br from-blue-50 to-blue-100 ${featuresVisible ? "animate-scaleIn stagger-3" : "opacity-0"}`}
            >
              <CardContent className="pt-6">
                <div className="text-6xl mb-6 hover-scale cursor-default">🏢</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">회사 단체배송 OK</h3>
                <p className="text-gray-600 leading-relaxed">4개 이상 주문 시<br />정기 배송 서비스</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 문제 인식 섹션 */}
      <section ref={problemRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 ${problemVisible ? "animate-fadeInUp" : "opacity-0"}`}
          >
            혹시 <span className="gradient-text">이런 고민</span> 해보셨나요?
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`${problemVisible ? "animate-fadeInLeft" : "opacity-0"}`}>
              <div className="space-y-6 text-lg">
                <div className="flex items-start p-4 bg-white rounded-lg shadow-sm hover-lift">
                  <span className="text-orange-500 mr-4 text-2xl">😫</span>
                  <span className="text-gray-700 font-medium">매일 배달앱 뒤지느라 시간 낭비하고 있어요</span>
                </div>
                <div className="flex items-start p-4 bg-white rounded-lg shadow-sm hover-lift">
                  <span className="text-orange-500 mr-4 text-2xl">⏰</span>
                  <span className="text-gray-700 font-medium">줄 서서 식사하니 점심시간이 허무해져요</span>
                </div>
                <div className="flex items-start p-4 bg-white rounded-lg shadow-sm hover-lift">
                  <span className="text-orange-500 mr-4 text-2xl">🤷‍♀️</span>
                  <span className="text-gray-700 font-medium">도시락 직접 챙기자니 너무 번거로워요</span>
                </div>
                <div className="flex items-start p-4 bg-white rounded-lg shadow-sm hover-lift">
                  <span className="text-orange-500 mr-4 text-2xl">💔</span>
                  <span className="text-gray-700 font-medium">건강한 식단 관리를 하고 싶은데 정보가 부족해요</span>
                </div>
              </div>
            </div>
            <div className={`text-center ${problemVisible ? "animate-fadeInRight" : "opacity-0"}`}>
              <div className="relative">
                <div className="text-9xl opacity-10 absolute -top-6 -left-6">💭</div>
                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover-lift">
                  <div className="text-8xl mb-4">😰</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">바쁜 직장인의 고민</h3>
                  <p className="text-gray-600">이런 고민들, 이제 그만!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 이용 방법 섹션 */}
      <section id="process" ref={stepsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 ${stepsVisible ? "animate-fadeInUp" : "opacity-0"}`}
          >
            <span className="gradient-text">정기 도시락</span> 이용 방법
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className={`text-center ${stepsVisible ? "animate-fadeInUp stagger-1" : "opacity-0"}`}>
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto hover-scale transition-all duration-300 shadow-lg">
                1
                </div>
                <div className="absolute -top-2 -right-2 text-2xl">📅</div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">요일 & 횟수 선택</h3>
              <p className="text-gray-600 leading-relaxed">주3~5회, 점심/저녁<br />원하는 대로 선택 가능</p>
            </div>
            <div className={`text-center ${stepsVisible ? "animate-fadeInUp stagger-2" : "opacity-0"}`}>
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto hover-scale transition-all duration-300 shadow-lg">
                2
                </div>
                <div className="absolute -top-2 -right-2 text-2xl">📱</div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">간편 주문</h3>
              <p className="text-gray-600 leading-relaxed">인스타 DM 또는<br />전화로 간단 주문</p>
            </div>
            <div className={`text-center ${stepsVisible ? "animate-fadeInUp stagger-3" : "opacity-0"}`}>
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto hover-scale transition-all duration-300 shadow-lg">
                3
                </div>
                <div className="absolute -top-2 -right-2 text-2xl">🚚</div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">신속 배송</h3>
              <p className="text-gray-600 leading-relaxed">오후 1시 전 주문 시<br />익일부터 배송 시작</p>
            </div>
            <div className={`text-center ${stepsVisible ? "animate-fadeInUp stagger-4" : "opacity-0"}`}>
              <div className="relative mb-8">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold mx-auto hover-scale transition-all duration-300 shadow-lg">
                4
                </div>
                <div className="absolute -top-2 -right-2 text-2xl">✅</div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">배송 완료</h3>
              <p className="text-gray-600 leading-relaxed">정해진 시간에<br />사무실 앞 안전 배송</p>
            </div>
          </div>
        </div>
      </section>

      {/* 고객 후기 섹션 */}
      <section id="reviews" ref={testimonialsRef} className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 ${testimonialsVisible ? "animate-fadeInUp" : "opacity-0"}`}
          >
            고객들이 말하는 <span className="gradient-text">미미인 도시락</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`p-6 card-hover bg-white ${testimonialsVisible ? `animate-scaleIn stagger-${index + 1}` : "opacity-0"}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI 추천 섹션 */}
      <AIRecommendation />

      {/* FAQ 섹션 */}
      <section id="faq" ref={faqRef} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className={`text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 ${faqVisible ? "animate-fadeInUp" : "opacity-0"}`}
          >
            <span className="gradient-text">자주 묻는</span> 질문
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className={`card-hover bg-white ${faqVisible ? `animate-fadeInUp stagger-${index + 1}` : "opacity-0"}`}
              >
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-orange-50 transition-colors duration-300"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</span>
                    <div className="hover-scale flex-shrink-0">
                      {openFaq === index ? (
                        <ChevronUpIcon className="w-6 h-6 text-orange-500" />
                      ) : (
                        <ChevronDownIcon className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 animate-fadeInUp">
                      <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 최종 CTA 섹션 */}
      <section
        ref={ctaRef}
        className="py-20 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden"
      >
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-white/10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>

        <div
          className={`relative z-10 max-w-4xl mx-auto px-4 text-center text-white ${ctaVisible ? "animate-fadeInUp" : "opacity-0"}`}
        >
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">더 이상 고민하지 마세요!</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            지금 바로 정기 도시락을 신청하고<br />
            편안하고 맛있는 점심을 만나보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleInstagramClick}
              className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-12 py-6 hover-glow transition-all duration-300 hover:scale-105 shadow-lg font-bold"
            >
              📞 지금 주문하기
            </Button>
            <Button
              size="lg"
              onClick={handleInstagramClick}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 text-xl px-12 py-6 transition-all duration-300 hover:scale-105 shadow-lg font-bold backdrop-blur-sm"
            >
              📸 인스타그램 구경
            </Button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* 브랜드 정보 */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={handleInstagramClick}>
                <div className="text-2xl">🍱</div>
                <span className="text-2xl font-bold">미미인 도시락</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                30년 경력의 주방장이 직접 만드는 건강하고 맛있는 정기 도시락 서비스입니다.<br />
                직장인들의 든든한 한 끼를 책임지겠습니다.
              </p>
              <div className="flex space-x-4">
                <div 
                  className="bg-orange-500 p-3 rounded-full hover-scale cursor-pointer"
                  onClick={handleInstagramClick}
                >
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <div className="bg-orange-500 p-3 rounded-full hover-scale cursor-pointer">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <div className="bg-orange-500 p-3 rounded-full hover-scale cursor-pointer">
                  <ClockIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div>
              <h3 className="text-lg font-bold mb-4">연락처</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="w-4 h-4 text-orange-500" />
                  <span>010-1234-5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-orange-500" />
                  <span>창원, 마산, 진해</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-orange-500" />
                  <span>오전 9시 - 오후 6시</span>
                </div>
              </div>
            </div>

            {/* 소셜 미디어 */}
            <div>
              <h3 className="text-lg font-bold mb-4">소셜 미디어</h3>
              <div className="space-y-3 text-gray-400">
                <div 
                  className="cursor-pointer hover:text-orange-500 transition-colors"
                  onClick={handleInstagramClick}
                >
                  📸 @mimin.dosirak
                </div>
                <div 
                  className="cursor-pointer hover:text-orange-500 transition-colors"
                  onClick={handleInstagramClick}
                >
                  💬 카카오톡 문의
                </div>
                <div 
                  className="cursor-pointer hover:text-orange-500 transition-colors"
                  onClick={handleInstagramClick}
                >
                  📧 이메일 문의
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 미미인 도시락. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
