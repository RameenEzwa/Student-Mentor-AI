import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth, AuthRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login: setAuth } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    loginMutation.mutate({ data }, {
      onSuccess: (result) => {
        if (result.success) {
          setAuth({ token: result.token, role: result.role as AuthRole });
          setLocation(`/${result.role}`);
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: result.message || "Invalid credentials",
          });
        }
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "An error occurred during login.",
        });
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left side: Information */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-primary text-primary-foreground relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Student Mentor AI</h1>
          <p className="text-xl text-primary-foreground/80 mb-12">
            AI-Driven Predictive Analytics for Educational Quality Assurance
          </p>
          
          <Accordion type="single" collapsible className="w-full mb-8">
            <AccordionItem value="sdg4" className="border-primary-foreground/20">
              <AccordionTrigger className="text-lg hover:text-white">UN SDG 4 Alignment</AccordionTrigger>
              <AccordionContent className="text-primary-foreground/80 leading-relaxed text-base">
                Ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all. Our analytics align with these global metrics to drive actionable quality improvements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="vision2030" className="border-primary-foreground/20">
              <AccordionTrigger className="text-lg hover:text-white">Vision 2030 Goals</AccordionTrigger>
              <AccordionContent className="text-primary-foreground/80 leading-relaxed text-base">
                Acting as a catalyst for a digital knowledge-based economy. Empowering educators with predictive tools to foster a future-ready workforce through targeted skill development.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="vision2035" className="border-primary-foreground/20">
              <AccordionTrigger className="text-lg hover:text-white">Vision 2035 Matrix</AccordionTrigger>
              <AccordionContent className="text-primary-foreground/80 leading-relaxed text-base">
                Implementing AI-driven early-intervention metrics to anticipate student needs, optimize resource allocation, and elevate institutional performance benchmarks.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="credentials" className="border-primary-foreground/20">
              <AccordionTrigger className="text-lg hover:text-white">Demo Credentials</AccordionTrigger>
              <AccordionContent>
                <div className="rounded-md border border-primary-foreground/20 overflow-hidden mt-2 bg-primary-foreground/5">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                        <TableHead className="text-primary-foreground font-semibold">Portal</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Username</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Password</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-primary-foreground/20 hover:bg-primary-foreground/10">
                        <TableCell className="font-medium">Student</TableCell>
                        <TableCell className="font-mono text-xs">student</TableCell>
                        <TableCell className="font-mono text-xs">learn2030</TableCell>
                      </TableRow>
                      <TableRow className="border-primary-foreground/20 hover:bg-primary-foreground/10">
                        <TableCell className="font-medium">Teacher/Admin</TableCell>
                        <TableCell className="font-mono text-xs">teacher</TableCell>
                        <TableCell className="font-mono text-xs">edu4all</TableCell>
                      </TableRow>
                      <TableRow className="border-primary-foreground/20 hover:bg-primary-foreground/10 border-b-0">
                        <TableCell className="font-medium">IT Specialist</TableCell>
                        <TableCell className="font-mono text-xs">admin</TableCell>
                        <TableCell className="font-mono text-xs">sys2035</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-black/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-none sm:border sm:shadow-lg sm:rounded-xl">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center text-base">
                Enter your credentials to access your portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username" 
                            {...field} 
                            className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary"
                            data-testid="input-username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary"
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold transition-all hover:translate-y-[-2px] hover:shadow-lg" 
                    disabled={loginMutation.isPending}
                    data-testid="button-submit-login"
                  >
                    {loginMutation.isPending ? "Authenticating..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
