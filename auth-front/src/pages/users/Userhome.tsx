import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart3, User, ShieldCheck, Activity, ArrowUpRight } from "lucide-react";
import { getCurrentUser } from "@/services/AuthService";
import useAuth from "@/auth/store";
import { useState } from "react";
import type UserT from "@/models/User";
import toast from "react-hot-toast";

function Userhome() {
  const user = useAuth((state) => state.user);
  const [user1, setUser1] = useState<UserT | null>(null);

  const getUserData = async () => {
    try {
      const user1 = await getCurrentUser(user?.email);

      setUser1(user1);
      toast.success("you are able to access secured apis")
    } catch (error) {
      console.log(error);
      toast.error("error in getting data");
    }
  };

  return (
    <div className="min-h-full bg-background text-foreground p-1 md:p-3">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-2 text-3xl font-bold tracking-tight md:text-4xl"
      >
        Good to see you, {user?.name?.split(" ")[0] || "there"}.
      </motion.h1>
      <p className="mb-8 max-w-2xl text-muted-foreground">
        Your secure workspace is ready. Review your account activity and keep your access up to date.
      </p>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            title: "Total Logins",
            value: "1,245",
            icon: <User className="w-8 h-8 text-primary" />,
          },
          {
            title: "Security Score",
            value: "98%",
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
          },
          {
            title: "Active Sessions",
            value: "12",
            icon: <Activity className="w-8 h-8 text-primary" />,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="p-3 bg-muted rounded-xl">{stat.icon}</div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-semibold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="mb-10 rounded-2xl border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
              <BarChart3 className="w-6 h-6 text-primary" /> Recent Activity
              </h2>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <li className="rounded-xl bg-muted/60 p-3">Logged in from Chrome on Windows</li>
              <li className="rounded-xl bg-muted/60 p-3">Password security is enabled</li>
              <li className="rounded-xl bg-muted/60 p-3">Trusted device list is current</li>
              <li className="rounded-xl bg-muted/60 p-3">No unusual sign-in activity</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dummy CTA */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold">Account verification</p>
          <p className="text-sm text-muted-foreground">Confirm your secure profile connection.</p>
        </div>
        <Button onClick={getUserData} className="rounded-xl px-5">
          Verify account
        </Button>
        {user1?.name && <p className="text-sm text-muted-foreground">Verified: {user1.name}</p>}
      </div>
    </div>
  );
}

export default Userhome;
