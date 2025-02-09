import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Plus } from 'lucide-react';

const notes = [
  {
    id: 1,
    title: "CSE465",
    description: "Deep Learning and Neural Networks",
    link: "/notes/CSE465/cse465.html",
    color: "bg-primary"
  },
  // {
  //   id: 2,
  //   title: "CSE466",
  //   description: "Advanced Programming Concepts",
  //   link: "/notes/CSE466/cse466.html",
  //   color: "bg-accent"
  // },
  // {
  //   id: 3,
  //   title: "CSE467",
  //   description: "Data Structures and Algorithms",
  //   link: "/notes/CSE467/cse467.html",
  //   color: "bg-secondary"
  // }
];

export default function Notes() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">My Notes</h1>
          {/* <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="opacity-0 animate-fadeIn"
            >
              <Link href={note.link} className="block group">
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                  <div className={`absolute top-0 left-0 w-2 h-full ${note.color}`} />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {note.title}
                    </CardTitle>
                    <CardDescription>{note.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {/* <span className="text-sm text-muted-foreground">Last updated: 2 days ago</span> */}
                      <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}