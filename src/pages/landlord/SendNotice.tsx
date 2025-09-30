import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function SendNotice({ onBackToDashboard }: { onBackToDashboard: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100">
      <Card className="shadow-2xl border-0 rounded-2xl bg-white/90 max-w-xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Bell className="h-6 w-6 text-yellow-500" />
            Send Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              className="border border-yellow-300 rounded-lg px-3 py-2 bg-yellow-50"
              placeholder="Tenant Name or Room"
            />
            <textarea
              className="border border-yellow-300 rounded-lg px-3 py-2 bg-yellow-50"
              rows={3}
              placeholder="Notice message..."
            />
            <Button type="submit" variant="outline" className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold shadow-md hover:from-yellow-500 hover:to-orange-500">
              Send Notice
            </Button>
          </form>
          <Button
            variant="outline"
            className="mt-6 w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 font-medium"
            onClick={onBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

