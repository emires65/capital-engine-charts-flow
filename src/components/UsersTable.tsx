
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  registrationDate: string;
  lastLoginDate?: string;
  loginAttempts?: number;
}

interface UsersTableProps {
  users: User[];
  onSelectUserForFunding: (userId: string, currentBalance: number) => void;
}

const UsersTable = ({ users, onSelectUserForFunding }: UsersTableProps) => {
  return (
    <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm mt-8">
      <CardHeader>
        <CardTitle className="text-white">
          🔴 LIVE: All Registered Users (Updates every 500ms)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl mb-2">No users registered yet.</p>
            <p className="text-sm">Users will appear here automatically when they register on the main website.</p>
            <p className="text-xs mt-2 text-slate-500">🔴 Live sync active - Updates every 500ms</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Balance</TableHead>
                <TableHead className="text-slate-300">Registration Date</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-white font-medium">{user.name}</TableCell>
                  <TableCell className="text-slate-300">{user.email}</TableCell>
                  <TableCell className="text-emerald-400 font-bold">
                    ${user.balance.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectUserForFunding(user.id, user.balance)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      💰 Fund User
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTable;
