import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const tenants = [
	{ name: "John Doe", room: "A-101", receiptsUploaded: 3, pendingReceipts: 1 },
	{ name: "Jane Smith", room: "B-205", receiptsUploaded: 2, pendingReceipts: 0 },
	{ name: "Mike Johnson", room: "C-102", receiptsUploaded: 1, pendingReceipts: 2 },
];

export default function ReviewReceipts({ onBackToDashboard }: { onBackToDashboard: () => void }) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
			<Card className="shadow-2xl border-0 rounded-2xl bg-white/90 max-w-xl w-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-blue-700">
						<FileText className="h-6 w-6 text-blue-500" />
						Review Receipts
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{tenants.map((tenant, idx) => (
							<div
								key={idx}
								className="flex items-center justify-between p-3 rounded-lg bg-blue-50"
							>
								<div>
									<p className="font-medium">
										{tenant.name} ({tenant.room})
									</p>
									<p className="text-sm text-muted-foreground">
										{tenant.receiptsUploaded} Verified, {tenant.pendingReceipts} Pending
									</p>
								</div>
								<Badge
									variant={
										tenant.pendingReceipts > 0 ? "secondary" : "default"
									}
								>
									{tenant.pendingReceipts > 0
										? "Pending"
										: "All Verified"}
								</Badge>
							</div>
						))}
					</div>
					<Button
						variant="outline"
						className="mt-6 w-full border-blue-300 text-blue-700 hover:bg-blue-50 font-medium"
						onClick={onBackToDashboard}
					>
						Back to Dashboard
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
	