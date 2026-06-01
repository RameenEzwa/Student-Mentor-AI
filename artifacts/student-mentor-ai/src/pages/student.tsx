import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePredictScore, useGetRecommendations, getGetRecommendationsQueryKey, useSendChatMessage } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, BrainCircuit, Activity, BookOpen, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const [factors, setFactors] = useState({
    hoursStudied: 15,
    attendance: 85,
    sleepHours: 7,
    previousScores: 75,
    tutoringSessions: 2,
    physicalActivity: 3,
    parentalInvolvement: "Medium",
    accessToResources: "Medium",
    motivationLevel: "Medium",
    internetAccess: "Yes",
    familyIncome: "Medium",
    teacherQuality: "Medium",
    peerInfluence: "Positive",
    extracurricularActivities: "Yes"
  });

  const predictMutation = usePredictScore();
  const { data: recommendationsData, isLoading: recsLoading } = useGetRecommendations({
    score: predictMutation.data?.predictedScore,
    hours_studied: factors.hoursStudied,
    attendance: factors.attendance,
    motivation: factors.motivationLevel
  }, {
    query: {
      queryKey: getGetRecommendationsQueryKey({
        score: predictMutation.data?.predictedScore,
        hours_studied: factors.hoursStudied,
        attendance: factors.attendance,
        motivation: factors.motivationLevel
      }),
      enabled: !!predictMutation.data
    }
  });

  const handlePredict = () => {
    predictMutation.mutate({ data: factors });
  };

  const handleFactorChange = (key: string, value: any) => {
    setFactors(prev => ({ ...prev, [key]: value }));
  };

  // Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: "user"|"assistant", content: string}[]>([
    { role: "assistant", content: "Hello! I'm your AI mentor. How can I help you with your studies today?" }
  ]);
  const chatMutation = useSendChatMessage();

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: "user" as const, content: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");

    chatMutation.mutate({
      data: { message: chatMessage, history: newHistory }
    }, {
      onSuccess: (data) => {
        setChatHistory(prev => [...prev, { role: "assistant", content: data.message }]);
      }
    });
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Student Workspace</h2>
        <p className="text-muted-foreground">Manage your performance factors, get AI predictions, and receive personalized guidance.</p>
      </div>

      <Tabs defaultValue="predict" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-14 items-center">
          <TabsTrigger value="predict" className="h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Activity className="w-4 h-4 mr-2" />
            AI Score Prediction
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sparkles className="w-4 h-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="chat" className="h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BrainCircuit className="w-4 h-4 mr-2" />
            AI Mentor Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predict">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Factors</CardTitle>
                <CardDescription>Adjust your current metrics to see how they impact your predicted score.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Hours Studied (Weekly)</label>
                      <span className="text-sm text-muted-foreground">{factors.hoursStudied}h</span>
                    </div>
                    <Slider 
                      value={[factors.hoursStudied]} 
                      max={40} 
                      step={1} 
                      onValueChange={([v]) => handleFactorChange("hoursStudied", v)} 
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Attendance Rate</label>
                      <span className="text-sm text-muted-foreground">{factors.attendance}%</span>
                    </div>
                    <Slider 
                      value={[factors.attendance]} 
                      max={100} 
                      step={1} 
                      onValueChange={([v]) => handleFactorChange("attendance", v)} 
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Sleep Hours (Nightly)</label>
                      <span className="text-sm text-muted-foreground">{factors.sleepHours}h</span>
                    </div>
                    <Slider 
                      value={[factors.sleepHours]} 
                      max={12} 
                      step={1} 
                      onValueChange={([v]) => handleFactorChange("sleepHours", v)} 
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Previous Scores</label>
                      <span className="text-sm text-muted-foreground">{factors.previousScores}</span>
                    </div>
                    <Slider 
                      value={[factors.previousScores]} 
                      max={100} 
                      step={1} 
                      onValueChange={([v]) => handleFactorChange("previousScores", v)} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Motivation Level</label>
                    <Select value={factors.motivationLevel} onValueChange={(v) => handleFactorChange("motivationLevel", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Extracurriculars</label>
                    <Select value={factors.extracurricularActivities} onValueChange={(v) => handleFactorChange("extracurricularActivities", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handlePredict} className="w-full mt-4" disabled={predictMutation.isPending}>
                  {predictMutation.isPending ? "Analyzing..." : "Generate Prediction"}
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
                <CardDescription>AI-generated forecast based on your factors</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                {predictMutation.data ? (
                  <div className="w-full flex flex-col items-center space-y-8">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                        <circle 
                          cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                          className="text-primary"
                          strokeDasharray={`${predictMutation.data.predictedScore * 2.827} 282.7`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-primary">{Math.round(predictMutation.data.predictedScore)}</span>
                        <span className="text-sm text-muted-foreground font-medium">Predicted Score</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5">Grade: {predictMutation.data.grade}</Badge>
                      <Badge variant="outline" className="px-3 py-1 text-sm">Confidence: {Math.round(predictMutation.data.confidence * 100)}%</Badge>
                    </div>

                    <div className="w-full space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Drivers</h4>
                      {predictMutation.data.featureImportance.slice(0, 3).map((feat, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{feat.feature.replace(/_/g, ' ')}</span>
                            <span className="font-medium text-primary">{(feat.importance * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={feat.importance * 100} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Adjust factors and generate prediction to see your results.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Personalised Directives</CardTitle>
              <CardDescription>Targeted actions based on your current performance profile.</CardDescription>
            </CardHeader>
            <CardContent>
              {!predictMutation.data ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                  <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
                  <p>Please generate a prediction first to receive personalized recommendations.</p>
                </div>
              ) : recsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendationsData?.recommendations.map((rec, i) => (
                    <div 
                      key={i} 
                      className={`p-5 rounded-lg border-l-4 ${
                        rec.priority === 'high' ? 'border-l-red-500 bg-red-50/50' : 
                        rec.priority === 'medium' ? 'border-l-amber-500 bg-amber-50/50' : 
                        'border-l-emerald-500 bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground">{rec.title}</h4>
                        <Badge variant="outline" className={`
                          ${rec.priority === 'high' ? 'text-red-700 border-red-200' : ''}
                          ${rec.priority === 'medium' ? 'text-amber-700 border-amber-200' : ''}
                          ${rec.priority === 'low' ? 'text-emerald-700 border-emerald-200' : ''}
                        `}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                AI Mentor
              </CardTitle>
              <CardDescription>Ask questions about your studies, schedule, or performance.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-800 rounded-lg rounded-tl-none p-3 text-sm flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-slate-50">
                {chatMutation.data?.suggestions && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {chatMutation.data.suggestions.map((sug, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-primary/20 transition-colors py-1.5"
                        onClick={() => { setChatMessage(sug); }}
                      >
                        {sug}
                      </Badge>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input 
                    value={chatMessage} 
                    onChange={e => setChatMessage(e.target.value)} 
                    placeholder="Type your message..." 
                    className="flex-1"
                    disabled={chatMutation.isPending}
                  />
                  <Button type="submit" disabled={chatMutation.isPending || !chatMessage.trim()}>
                    <Send className="w-4 h-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
