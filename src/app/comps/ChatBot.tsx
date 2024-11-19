'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface Message {
  sender: 'user' | 'bot'
  content: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => setIsOpen(!isOpen)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const sendMessage = async () => {
    if (!userInput.trim()) return

    const newMessages: Message[] = [...messages, { sender: 'user', content: userInput }]
    setMessages(newMessages)
    setUserInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      })

      const data = await response.json()
      if (data.response) {
        setMessages([...newMessages, { sender: 'bot', content: data.response } as Message])
      } else {
        throw new Error("No response from the chatbot")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages([...newMessages, { sender: 'bot', content: "Error: Unable to fetch response" } as Message])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5">
      <Button
        onClick={toggleChat}
        size="icon"
        className="rounded-full shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Toggle chat</span>
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-5 w-80 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat with Us</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close chat</span>
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] pr-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={userInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}