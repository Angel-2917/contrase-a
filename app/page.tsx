"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Eye, EyeOff, Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WordField {
  id: string
  value: string
  isValid: boolean
  errors: string[]
}

interface PasswordRules {
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumbers: boolean
  hasSymbols: boolean
  noCommonWords: boolean
  noPersonalInfo: boolean
}

const commonWords = [
  "password",
  "123456",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "master",
  "hello",
  "freedom",
  "whatever",
  "computer",
  "internet",
  "security",
  "system",
  "user",
  "guest",
]

const personalInfoPatterns = [
  /\b(19|20)\d{2}\b/, // años
  /\b(0[1-9]|[12][0-9]|3[01])\b/, // días
  /\b(0[1-9]|1[0-2])\b/, // meses
]

export default function PasswordGenerator() {
  const [words, setWords] = useState<WordField[]>([{ id: "1", value: "", isValid: false, errors: [] }])
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordRules, setPasswordRules] = useState<PasswordRules>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSymbols: false,
    noCommonWords: false,
    noPersonalInfo: false,
  })

  const validateWord = (word: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (word.length < 3) {
      errors.push("Muy corta (mínimo 3 caracteres)")
    }

    if (commonWords.includes(word.toLowerCase())) {
      errors.push("Palabra muy común")
    }

    if (personalInfoPatterns.some((pattern) => pattern.test(word))) {
      errors.push("Contiene información personal (fechas)")
    }

    if (/^\d+$/.test(word)) {
      errors.push("Solo números no es seguro")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const addWordField = () => {
    const newId = (words.length + 1).toString()
    setWords([...words, { id: newId, value: "", isValid: false, errors: [] }])
  }

  const removeWordField = (id: string) => {
    if (words.length > 1) {
      setWords(words.filter((word) => word.id !== id))
    }
  }

  const updateWord = (id: string, value: string) => {
    const validation = validateWord(value)
    setWords(
      words.map((word) =>
        word.id === id ? { ...word, value, isValid: validation.isValid, errors: validation.errors } : word,
      ),
    )
  }

  const generatePassword = () => {
    const validWords = words.filter((word) => word.value.trim() !== "")
    if (validWords.length === 0) return ""

    // Combinar palabras con símbolos y números aleatorios
    const symbols = ["!", "@", "#", "$", "%", "&", "*", "+", "=", "?"]
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    let password = ""
    validWords.forEach((word, index) => {
      // Capitalizar primera letra de cada palabra
      const capitalizedWord = word.value.charAt(0).toUpperCase() + word.value.slice(1).toLowerCase()
      password += capitalizedWord

      // Agregar símbolo o número entre palabras (excepto la última)
      if (index < validWords.length - 1) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)]
        password += Math.random() > 0.5 ? randomSymbol : randomNumber
      }
    })

    // Agregar símbolo y números al final para mayor seguridad
    const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)]
    const finalNumbers = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")
    password += finalNumbers + finalSymbol

    return password
  }

  const checkPasswordRules = (password: string): PasswordRules => {
    return {
      hasMinLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSymbols: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      noCommonWords: !commonWords.some((common) => password.toLowerCase().includes(common)),
      noPersonalInfo: !personalInfoPatterns.some((pattern) => pattern.test(password)),
    }
  }

  useEffect(() => {
    const password = generatePassword()
    setGeneratedPassword(password)
    setPasswordRules(checkPasswordRules(password))
  }, [words])

  const getPasswordStrength = () => {
    const rules = Object.values(passwordRules)
    const passedRules = rules.filter(Boolean).length
    const percentage = (passedRules / rules.length) * 100

    if (percentage >= 85) return { level: "Muy Fuerte", color: "bg-green-500", textColor: "text-green-700" }
    if (percentage >= 70) return { level: "Fuerte", color: "bg-blue-500", textColor: "text-blue-700" }
    if (percentage >= 50) return { level: "Moderada", color: "bg-yellow-500", textColor: "text-yellow-700" }
    return { level: "Débil", color: "bg-red-500", textColor: "text-red-700" }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Shield className="h-10 w-10 text-blue-600" />
            Generador de Contraseñas S3guR4$
          </h1>
          <p className="text-sm text-gray-500 mb-2">
            Creado por <span className="font-semibold text-blue-600">Angel Hernández</span>
          </p>
          <p className="text-lg text-gray-600">
            Crea contraseñas seguras siguiendo las mejores prácticas de ciberseguridad
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel Principal - Generador */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Ingresa tus Palabras
                </CardTitle>
                <CardDescription>Agrega las palabras que quieras usar para crear tu contraseña segura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {words.map((word, index) => (
                  <div key={word.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <Input
                          placeholder={`Palabra ${index + 1}`}
                          value={word.value}
                          onChange={(e) => updateWord(word.id, e.target.value)}
                          className={`${
                            word.value && !word.isValid
                              ? "border-red-300 focus:border-red-500"
                              : word.value && word.isValid
                                ? "border-green-300 focus:border-green-500"
                                : ""
                          }`}
                        />
                        {word.value && (
                          <div className="flex items-center">
                            {word.isValid ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      {word.errors.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {word.errors.map((error, errorIndex) => (
                            <p key={errorIndex} className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {error}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeWordField(word.id)}
                      disabled={words.length === 1}
                      className="shrink-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button onClick={addWordField} variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar otra palabra
                </Button>
              </CardContent>
            </Card>

            {/* Contraseña Generada */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tu Contraseña Generada</span>
                  <Badge variant="outline" className={strength.textColor}>
                    {strength.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={generatedPassword}
                      type={showPassword ? "text" : "password"}
                      readOnly
                      className="font-mono text-lg"
                    />
                    <Button variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      onClick={() => navigator.clipboard.writeText(generatedPassword)}
                      disabled={!generatedPassword}
                    >
                      Copiar
                    </Button>
                  </div>

                  {/* Barra de fortaleza */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fortaleza de la contraseña</span>
                      <span className={strength.textColor}>{strength.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(Object.values(passwordRules).filter(Boolean).length / 7) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Reglas cumplidas */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div
                      className={`flex items-center gap-2 ${passwordRules.hasMinLength ? "text-green-600" : "text-red-600"}`}
                    >
                      {passwordRules.hasMinLength ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      12+ caracteres
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRules.hasUppercase ? "text-green-600" : "text-red-600"}`}
                    >
                      {passwordRules.hasUppercase ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Mayúsculas
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRules.hasLowercase ? "text-green-600" : "text-red-600"}`}
                    >
                      {passwordRules.hasLowercase ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Minúsculas
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRules.hasNumbers ? "text-green-600" : "text-red-600"}`}
                    >
                      {passwordRules.hasNumbers ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Números
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRules.hasSymbols ? "text-green-600" : "text-red-600"}`}
                    >
                      {passwordRules.hasSymbols ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Símbolos
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRules.noCommonWords ? "text-green-600" : "text-red-600"}`}
                    >
                      {passwordRules.noCommonWords ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      No común
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral - Reglas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📋 Reglas de Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">1. Longitud Mínima</h4>
                  <p className="text-gray-600">Al menos 12 caracteres para mayor seguridad</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">2. Combinación de Caracteres</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Letras mayúsculas (A-Z)</li>
                    <li>• Letras minúsculas (a-z)</li>
                    <li>• Números (0-9)</li>
                    <li>• Símbolos (!, @, #, $, etc.)</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">3. Evita lo Obvio</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• No palabras comunes</li>
                    <li>• No nombres propios</li>
                    <li>• No fechas importantes</li>
                    <li>• No secuencias simples</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">4. Frases Secretas</h4>
                  <p className="text-gray-600">Combina palabras únicas que tengan sentido para ti</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Consejos Adicionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Cambia regularmente:</strong> Actualiza tus contraseñas cada 3-6 meses
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>No reutilices:</strong> Una contraseña única por cada cuenta
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Usa 2FA:</strong> Activa autenticación de dos factores siempre que sea posible
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Gestor de contraseñas:</strong> Considera usar LastPass, 1Password o Dashlane
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">✅ Ejemplo Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-sm font-mono bg-white p-2 rounded border block">T!g3rL!ly#2024!RunS</code>
                <p className="text-sm text-green-700 mt-2">
                  Combina palabras, números, símbolos y tiene más de 12 caracteres
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
