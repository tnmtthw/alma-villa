"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Clock, User, Lock, CheckCircle, XCircle, AlertTriangle, 
  RefreshCw, Database, Users as UsersIcon, Eye 
} from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  data?: any
  timestamp: string
}

interface DatabaseUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  loginAttempts: number
  lastFailedLogin: string | null
  lockedUntil: string | null
  createdAt: string
  isCurrentlyLocked: boolean
  lockoutTimeLeft: number
  attemptsRemaining: number
}

export default function TestingPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("wrongpassword")
  const [results, setResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lockoutStatus, setLockoutStatus] = useState<any>(null)
  const [databaseUsers, setDatabaseUsers] = useState<DatabaseUser[]>([])
  const [selectedUser, setSelectedUser] = useState<DatabaseUser | null>(null)
  const [showUserList, setShowUserList] = useState(false)

  const addResult = (success: boolean, message: string, data?: any) => {
    const result: TestResult = {
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }
    setResults(prev => [result, ...prev])
  }

  // Fetch existing users from database
  const fetchDatabaseUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug/users")
      const data = await response.json()
      
      if (data.success) {
        setDatabaseUsers(data.users)
        addResult(true, `Found ${data.count} users in database`, { count: data.count })
      } else {
        addResult(false, `Failed to fetch users: ${data.error}`, data)
      }
    } catch (error) {
      addResult(false, `Error fetching users: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset a user's login attempts
  const resetUserAttempts = async (userEmail: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, action: "reset" }),
      })

      const data = await response.json()
      
      if (data.success) {
        addResult(true, `✅ Reset successful: ${data.message}`, data.user)
        // Refresh user list
        await fetchDatabaseUsers()
        // Refresh lockout status if this is the selected user
        if (email === userEmail) {
          setTimeout(checkLockoutStatus, 500)
        }
      } else {
        addResult(false, `Reset failed: ${data.error}`, data)
      }
    } catch (error) {
      addResult(false, `Reset error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkLockoutStatus = async () => {
    if (!email) return
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/check-lockout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setLockoutStatus(data)
      
      if (response.ok) {
        addResult(true, `Lockout Status: ${data.isLocked ? 'LOCKED' : 'UNLOCKED'}`, data)
      } else {
        addResult(false, `Check failed: ${data.error}`, data)
      }
    } catch (error) {
      addResult(false, `Error checking lockout: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const attemptLogin = async () => {
    if (!email) {
      addResult(false, "Please enter an email address")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      
      if (response.ok) {
        addResult(true, `Login successful! ✅`, data)
      } else if (response.status === 423) {
        addResult(false, `Account LOCKED! 🔒 Time left: ${data.timeLeft}s`, data)
      } else if (response.status === 401) {
        addResult(false, `Login failed! ❌ Attempts left: ${data.attemptsLeft}`, data)
      } else {
        addResult(false, `Error: ${data.error}`, data)
      }

      // Auto-refresh lockout status and user list after each attempt
      setTimeout(() => {
        checkLockoutStatus()
        fetchDatabaseUsers()
      }, 500)
    } catch (error) {
      addResult(false, `Network error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const selectUser = (user: DatabaseUser) => {
    setSelectedUser(user)
    setEmail(user.email)
    addResult(true, `Selected user: ${user.email} (${user.firstName} ${user.lastName})`)
    setShowUserList(false)
    // Auto-check their lockout status
    setTimeout(checkLockoutStatus, 100)
  }

  const clearResults = () => {
    setResults([])
    setLockoutStatus(null)
  }

  // Fetch users on component mount
  useEffect(() => {
    fetchDatabaseUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Login Lockout Testing - Database Users
            </CardTitle>
            <CardDescription>
              Test the login attempt tracking with your existing database users
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Database Users Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Database Users ({databaseUsers.length})
              </span>
              <div className="flex gap-2">
                <Button 
                  onClick={fetchDatabaseUsers} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  onClick={() => setShowUserList(!showUserList)}
                  variant="outline" 
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showUserList ? 'Hide' : 'Show'} Users
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          {showUserList && (
            <CardContent>
              {databaseUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No users found in database. Create some users first.
                </div>
              ) : (
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {databaseUsers.map((user) => (
                    <div 
                      key={user.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => selectUser(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{user.email}</div>
                          <div className="text-sm text-gray-600">
                            {user.firstName} {user.lastName} • {user.role}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.isCurrentlyLocked && (
                            <Badge variant="destructive" className="text-xs">
                              🔒 Locked ({user.lockoutTimeLeft}s)
                            </Badge>
                          )}
                          {user.loginAttempts > 0 && !user.isCurrentlyLocked && (
                            <Badge variant="secondary" className="text-xs">
                              {user.attemptsRemaining} attempts left
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email {selectedUser && <span className="text-blue-600">(Selected: {selectedUser.firstName} {selectedUser.lastName})</span>}
                </label>
                <Input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Select a user above or enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password (use wrong password to trigger lockout)</label>
                <Input 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="wrongpassword"
                  type="password"
                />
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>How to test:</strong> Select a user above, use a wrong password, and click "Attempt Login" 3 times to trigger lockout. 
                The account will be locked for 1 minute after 3 failed attempts.
              </AlertDescription>
            </Alert>

            <div className="flex flex-wrap gap-3">
              <Button onClick={attemptLogin} disabled={isLoading || !email}>
                <User className="h-4 w-4 mr-2" />
                Attempt Login
              </Button>
              <Button onClick={checkLockoutStatus} variant="outline" disabled={isLoading || !email}>
                <Clock className="h-4 w-4 mr-2" />
                Check Status
              </Button>
              {email && (
                <Button onClick={() => resetUserAttempts(email)} variant="secondary" disabled={isLoading}>
                  Reset Account
                </Button>
              )}
              <Button onClick={clearResults} variant="ghost">
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        {lockoutStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Current Account Status - {email}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${lockoutStatus.isLocked ? 'text-red-600' : 'text-green-600'}`}>
                    {lockoutStatus.isLocked ? '🔒' : '🔓'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {lockoutStatus.isLocked ? 'LOCKED' : 'UNLOCKED'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {lockoutStatus.attemptsLeft || 0}
                  </div>
                  <div className="text-sm text-gray-600">Attempts Left</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {lockoutStatus.loginAttempts || 0}
                  </div>
                  <div className="text-sm text-gray-600">Failed Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {lockoutStatus.timeLeft || 0}s
                  </div>
                  <div className="text-sm text-gray-600">Time Left</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Latest results first. Testing with real database users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No test results yet. Select a user and click "Attempt Login" to start testing.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">{result.message}</span>
                      </div>
                      <Badge variant="outline">{result.timestamp}</Badge>
                    </div>
                    {result.data && (
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card>
          <CardHeader>
            <CardTitle>Security Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-medium text-blue-900">Max Attempts</div>
                <div className="text-blue-700">3 attempts before lockout</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="font-medium text-orange-900">Lockout Duration</div>
                <div className="text-orange-700">1 minute</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-green-900">Auto Reset</div>
                <div className="text-green-700">After lockout expires</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}