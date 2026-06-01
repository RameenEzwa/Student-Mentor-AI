import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  useGetDatasetSummary, getGetDatasetSummaryQueryKey,
  useGetScoreDistribution, getGetScoreDistributionQueryKey,
  useGetFactorAnalysis, getGetFactorAnalysisQueryKey,
  useGetAtRiskStudents, getGetAtRiskStudentsQueryKey
} from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TeacherDashboard() {
  const { data: summary } = useGetDatasetSummary({
    query: { queryKey: getGetDatasetSummaryQueryKey() }
  });

  const { data: distribution } = useGetScoreDistribution({
    query: { queryKey: getGetScoreDistributionQueryKey() }
  });

  const [threshold, setThreshold] = useState(60);
  const { data: atRisk } = useGetAtRiskStudents({ threshold }, {
    query: { queryKey: getGetAtRiskStudentsQueryKey({ threshold }) }
  });

  const [factor, setFactor] = useState("Parental_Involvement");
  const { data: factorAnalysis } = useGetFactorAnalysis({ factor }, {
    query: { queryKey: getGetFactorAnalysisQueryKey({ factor }) }
  });

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Command Center</h2>
        <p className="text-muted-foreground">Monitor cohort performance, identify at-risk students, and analyze impact factors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80 flex justify-between">
              Cohort Mean Score
              <TrendingUp className="w-4 h-4 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.meanScore ? summary.meanScore.toFixed(1) : "---"}</div>
            <p className="text-xs text-primary-foreground/60 mt-1">out of 100</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
              High Achievers
              <Users className="w-4 h-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{summary?.highAchieversCount || "---"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Students scoring > 85"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
              At-Risk Students
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{summary?.atRiskCount || "---"}</div>
            <p className="text-xs text-muted-foreground mt-1">{"Students scoring < 60"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-14 items-center bg-muted/50 p-1">
          <TabsTrigger value="distribution" className="h-10 data-[state=active]:shadow-sm">
            Score Distribution
          </TabsTrigger>
          <TabsTrigger value="at-risk" className="h-10 data-[state=active]:shadow-sm">
            At-Risk Tracker
          </TabsTrigger>
          <TabsTrigger value="factors" className="h-10 data-[state=active]:shadow-sm">
            Factor Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Score Distribution</CardTitle>
              <CardDescription>Histogram of student exam scores across the entire dataset.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full mt-4">
                {distribution ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distribution.bins} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                      />
                      <RechartsTooltip 
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                        {distribution.bins.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.rangeEnd <= 60 ? 'hsl(var(--destructive))' : 
                            entry.rangeEnd >= 85 ? '#10b981' : 
                            'hsl(var(--primary))'
                          } />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-50 animate-pulse rounded-lg" />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="at-risk">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>At-Risk Tracker</CardTitle>
                <CardDescription>Identify students falling below the target threshold.</CardDescription>
              </div>
              <div className="w-full sm:w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">Threshold</span>
                  <span className="font-bold text-destructive">{threshold}</span>
                </div>
                <Slider 
                  value={[threshold]} 
                  max={100} 
                  step={5} 
                  onValueChange={([v]) => setThreshold(v)} 
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Hours Studied</TableHead>
                      <TableHead>Prev. Score</TableHead>
                      <TableHead>Motivation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRisk?.students.map((student) => (
                      <TableRow key={student.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">#{student.id}</TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="font-bold">{student.examScore}</Badge>
                        </TableCell>
                        <TableCell>{student.attendance}%</TableCell>
                        <TableCell>{student.hoursStudied}h</TableCell>
                        <TableCell>{student.previousScores}</TableCell>
                        <TableCell>{student.motivationLevel}</TableCell>
                      </TableRow>
                    ))}
                    {atRisk?.students.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No students found below this threshold.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-right">
                Showing {atRisk?.students.length || 0} students
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle>Factor Analysis</CardTitle>
                <CardDescription>Analyze how different variables correlate with exam scores.</CardDescription>
              </div>
              <div className="w-full md:w-64">
                <Select value={factor} onValueChange={setFactor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a factor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parental_Involvement">Parental Involvement</SelectItem>
                    <SelectItem value="Access_to_Resources">Access to Resources</SelectItem>
                    <SelectItem value="Motivation_Level">Motivation Level</SelectItem>
                    <SelectItem value="Internet_Access">Internet Access</SelectItem>
                    <SelectItem value="Family_Income">Family Income</SelectItem>
                    <SelectItem value="Teacher_Quality">Teacher Quality</SelectItem>
                    <SelectItem value="Peer_Influence">Peer Influence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full mt-4">
                {factorAnalysis ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={factorAnalysis.groups} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        formatter={(value: number) => [`${value.toFixed(1)}`, 'Mean Score']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="meanScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-50 animate-pulse rounded-lg" />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
