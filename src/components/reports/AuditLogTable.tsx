
import React from "react";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  MessageSquare, 
  PlusCircle,
  Search
} from "lucide-react";
import { AuditLog } from "@/services/reportingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditLogTableProps {
  logs: AuditLog[];
  onFilterChange: (searchTerm: string) => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, onFilterChange }) => {
  const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
      case 'approve':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'reject':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'modify':
        return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'create':
        return <PlusCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getActionBadge = (action: AuditLog['action']) => {
    const variants: Record<AuditLog['action'], string> = {
      'approve': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'reject': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'modify': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'delete': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'comment': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'create': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
    
    return (
      <Badge className={variants[action]}>
        {action.charAt(0).toUpperCase() + action.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Audit Log</CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              onChange={(e) => onFilterChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden md:table-cell">Target ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="hidden md:inline">
                          {getActionBadge(log.action)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">
                      {log.targetId}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={log.details}>
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AuditLogTable;
