import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  useGetDatasetSummary, getGetDatasetSummaryQueryKey,
  useGetRawData, getGetRawDataQueryKey,
  useGetDataIntegrity, getGetDataIntegrityQueryKey
} from "@workspace/api-client-react";
import { Database, Search, ShieldCheck, Terminal, HardDrive, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: summary } = useGetDatasetSummary({ query: { queryKey: getGetDatasetSummaryQueryKey() } });
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: rawData, isLoading: rawLoading } = useGetRawData({ page, pageSize: 10, search }, {
    query: { queryKey: getGetRawDataQueryKey({ page, pageSize: 10, search }) }
  });

  const { data: integrity } = useGetDataIntegrity({ query: { queryKey: getGetDataIntegrityQueryKey() } });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const handleSimulation = () => {
    setIsSimulating(true);
    setSimLogs(["Initializing ingestion pipeline..."]);
    
    const logs = [
      "Connecting to primary datastore...",
      "Extracting 6,607 records...",
      "Applying transformation rules...",
      "Checking schema validation...",
      "Resolving null mappings...",
      "Updating ML feature store...",
      "Pipeline execution completed successfully."
    ];

    let i = 0;
    const interval = setInterval(() => {
      setSimLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,-1)}] ${logs[i]}`]);
      i++;
      if (i >= logs.length) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 800);
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">IT Diagnostics & Data</h2>
          <p className="text-muted-foreground">Manage dataset pipelines, view raw records, and monitor system integrity.</p>
        </div>
        <Button onClick={handleSimulation} disabled={isSimulating} className="shrink-0">
          <RefreshCcw className={`w-4 h-4 mr-2 ${isSimulating ? 'animate-spin' : ''}`} />
          {isSimulating ? 'Executing Pipeline...' : 'Run Mock Ingestion Pipeline'}
        </Button>
      </div>

      {simLogs.length > 0 && (
        <Card className="mb-8 border-slate-800 bg-slate-950 text-slate-50">
          <CardHeader className="py-3 border-b border-slate-800">
            <CardTitle className="text-sm font-mono flex items-center">
              <Terminal className="w-4 h-4 mr-2" />
              Pipeline Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 font-mono text-xs space-y-1 h-40 overflow-y-auto">
            {simLogs.map((log, i) => (
              <div key={i} className={log.includes("completed") ? "text-emerald-400" : "text-slate-300"}>
                {log}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-14 items-center">
          <TabsTrigger value="summary" className="h-10">
            <Database className="w-4 h-4 mr-2" />
            Dataset Summary
          </TabsTrigger>
          <TabsTrigger value="raw" className="h-10">
            <HardDrive className="w-4 h-4 mr-2" />
            Raw Data
          </TabsTrigger>
          <TabsTrigger value="integrity" className="h-10">
            <ShieldCheck className="w-4 h-4 mr-2" />
            System Integrity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Dataset Stats</CardTitle>
                <CardDescription>Overview of the current data warehouse state.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Records</div>
                  <div className="text-3xl font-bold">{summary?.totalRecords.toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Feature Columns</div>
                    <div className="text-xl font-bold">{summary?.featureColumns.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Null Density</div>
                    <div className="text-xl font-bold text-emerald-600">0.0%</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-3">Feature List Sample</div>
                  <div className="flex flex-wrap gap-2">
                    {summary?.featureColumns.slice(0, 8).map(f => (
                      <Badge key={f} variant="secondary" className="font-mono text-xs">{f}</Badge>
                    ))}
                    <Badge variant="outline" className="font-mono text-xs border-dashed">+ {summary?.featureColumns.length ? summary.featureColumns.length - 8 : 0} more</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Null Matrix</CardTitle>
                <CardDescription>Missing values count per feature column.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-slate-50 z-10">
                      <TableRow>
                        <TableHead>Column Name</TableHead>
                        <TableHead className="text-right">Null Count</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary?.nullCounts && Object.entries(summary.nullCounts).map(([col, count]) => (
                        <TableRow key={col}>
                          <TableCell className="font-mono text-sm">{col}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{count}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={count === 0 ? "outline" : "destructive"} className={count === 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}>
                              {count === 0 ? "Clean" : "Review"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="raw">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Data Viewer</CardTitle>
                <CardDescription>Direct access to the underlying datastore.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search records..." 
                  className="pl-8"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>School Type</TableHead>
                      <TableHead>Internet</TableHead>
                      <TableHead>Motivation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-48 text-center">Loading data...</TableCell>
                      </TableRow>
                    ) : rawData?.students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">No records found matching your search.</TableCell>
                      </TableRow>
                    ) : (
                      rawData?.students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-mono text-xs">{student.id}</TableCell>
                          <TableCell className="font-bold">{student.examScore}</TableCell>
                          <TableCell>{student.hoursStudied}</TableCell>
                          <TableCell>{student.attendance}%</TableCell>
                          <TableCell>{student.schoolType}</TableCell>
                          <TableCell>{student.internetAccess}</TableCell>
                          <TableCell>{student.motivationLevel}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {rawData && rawData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, rawData.total)} of {rawData.total} records
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(rawData.totalPages, p + 1))} disabled={page === rawData.totalPages}>Next</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Operational Logs</CardTitle>
                <CardDescription>Recent automated system checks and routine tasks.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrity?.systemLogs.map((log, i) => (
                    <div key={i} className="flex gap-3 text-sm pb-4 border-b last:border-0 last:pb-0">
                      <div className="mt-0.5"><Terminal className="w-4 h-4 text-muted-foreground" /></div>
                      <div>
                        <p className="text-slate-800">{log}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schema Integrity Checks</CardTitle>
                <CardDescription>Validation status across core data models.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Code</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {integrity?.schemaChecks.map((check, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{check.module}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${check.status === 'Pass' ? 'bg-emerald-500' : 'bg-destructive'}`}></span>
                              {check.status}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{check.code}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
