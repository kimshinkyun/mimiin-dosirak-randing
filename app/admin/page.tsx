'use client'

import { useState, useEffect } from 'react'
import { useCustomerStore, CustomerInfo } from '@/lib/stores/customer-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  LockIcon, 
  UsersIcon, 
  MailIcon, 
  PhoneIcon, 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  DownloadIcon,
  EyeIcon
} from 'lucide-react'

// 관리자 패스워드 (실제 환경에서는 환경변수나 더 안전한 방법 사용)
const ADMIN_PASSWORD = "gotls2ek3!@"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [customers, setCustomers] = useState<CustomerInfo[]>([])

  const { getCustomers, deleteCustomer } = useCustomerStore()

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadCustomers()
    }
  }, [])

  // 고객 정보 로드
  const loadCustomers = () => {
    const customerData = getCustomers()
    setCustomers(customerData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  // 로그인 처리
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin_auth', 'true')
      loadCustomers()
      setError('')
    } else {
      setError('잘못된 패스워드입니다.')
    }
  }

  // 로그아웃 처리
  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin_auth')
    setPassword('')
  }

  // 고객 삭제
  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('정말로 이 고객 정보를 삭제하시겠습니까?')) {
      deleteCustomer(customerId)
      loadCustomers()
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // CSV 다운로드
  const downloadCSV = () => {
    const headers = ['이름', '전화번호', '이메일', '등록일시', '식단표 접근', '개인정보 동의', '마케팅 동의']
    const csvContent = [
      headers.join(','),
      ...customers.map(customer => [
        customer.name,
        customer.phone,
        customer.email,
        formatDate(customer.createdAt),
        customer.accessedDietPlan ? '접근함' : '미접근',
        customer.agreements?.privacy ? '동의' : '미동의',
        customer.agreements?.marketing ? '동의' : '미동의'
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `고객정보_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // 인증되지 않은 경우 로그인 폼 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <LockIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              🍱 미미인 도시락 관리자
            </CardTitle>
            <p className="text-gray-600 mt-2">
              관리자 전용 페이지입니다
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  관리자 패스워드
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="패스워드를 입력하세요"
                  className="mt-1"
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 인증된 경우 관리자 대시보드 표시
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🍱</div>
              <h1 className="text-2xl font-bold text-gray-800">미미인 도시락 관리자</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={downloadCSV}
                className="flex items-center"
                disabled={customers.length === 0}
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                CSV 다운로드
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 통계 카드 */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 고객 수</p>
                  <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
                </div>
                <UsersIcon className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">식단표 접근</p>
                  <p className="text-3xl font-bold text-green-600">
                    {customers.filter(c => c.accessedDietPlan).length}
                  </p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">개인정보 동의</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {customers.filter(c => c.agreements?.privacy).length}
                  </p>
                </div>
                <LockIcon className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">마케팅 동의</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {customers.filter(c => c.agreements?.marketing).length}
                  </p>
                </div>
                <MailIcon className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">오늘 신규 고객</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {customers.filter(c => 
                      new Date(c.createdAt).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <CalendarIcon className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 고객 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2" />
              고객 정보 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">등록된 고객이 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-700">이름</th>
                      <th className="text-left p-4 font-medium text-gray-700">연락처</th>
                      <th className="text-left p-4 font-medium text-gray-700">이메일</th>
                      <th className="text-left p-4 font-medium text-gray-700">등록일시</th>
                      <th className="text-left p-4 font-medium text-gray-700">식단표 접근</th>
                      <th className="text-left p-4 font-medium text-gray-700">개인정보 동의</th>
                      <th className="text-left p-4 font-medium text-gray-700">마케팅 동의</th>
                      <th className="text-left p-4 font-medium text-gray-700">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-orange-600 font-medium text-sm">
                                {customer.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{customer.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-gray-600">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            {customer.phone}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-gray-600">
                            <MailIcon className="w-4 h-4 mr-2" />
                            {customer.email}
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="p-4">
                          {customer.accessedDietPlan ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              접근함
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                              <XCircleIcon className="w-3 h-3 mr-1" />
                              미접근
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          {customer.agreements?.privacy ? (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              동의
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                              <XCircleIcon className="w-3 h-3 mr-1" />
                              미동의
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          {customer.agreements?.marketing ? (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              동의
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                              <XCircleIcon className="w-3 h-3 mr-1" />
                              미동의
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 관리자 정보 푸터 */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <LockIcon className="w-4 h-4 mr-2 text-orange-500" />
            <span>개인정보 관리책임자: <span className="font-medium text-gray-800">김신균 (홈페이지 관리자)</span></span>
          </div>
        </div>
      </div>
    </div>
  )
} 