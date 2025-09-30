import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function AddTenant({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-blue-100">
      <Card className="shadow-2xl border-0 rounded-2xl bg-white/90 max-w-xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Users className="h-6 w-6 text-green-500" />
            Add Tenant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              className="border border-green-300 rounded-lg px-3 py-2 bg-green-50"
              placeholder="Tenant Name"
            />
            <input
              type="text"
              className="border border-green-300 rounded-lg px-3 py-2 bg-green-50"
              placeholder="Room Number"
            />
            <input
              type="email"
              className="border border-green-300 rounded-lg px-3 py-2 bg-green-50"
              placeholder="Email"
            />
            <input
              type="text"
              className="border border-green-300 rounded-lg px-3 py-2 bg-green-50"
              placeholder="Phone"
            />
            <Button type="submit" variant="outline" className="w-full bg-gradient-to-r from-green-400 to-teal-400 text-white font-semibold shadow-md hover:from-green-500 hover:to-teal-500">
              Add Tenant
            </Button>
          </form>
          <Button
            variant="outline"
            className="mt-6 w-full border-green-300 text-green-700 hover:bg-green-50 font-medium"
            onClick={onBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


