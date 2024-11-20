import { Card, CardContent } from '@/components/ui/card';
import { Icon, LucideIcon, AlertTriangle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  number: string | number;
  description: string;
  iconColor?: string;
}

export default function MetricCard({
  title = 'Total Properties',
  icon: Icon = AlertTriangle,
  number = 'Somethings went wrong',
  description = 'Somethings went wrong',
  iconColor = 'text-gray-500',
}: MetricCardProps) {
  return (
    <Card className="flex-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{number}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`${iconColor} opacity-80`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
