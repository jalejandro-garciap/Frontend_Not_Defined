import { Card, CardBody, Chip } from "@heroui/react";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

interface TokenExpirationAlertProps {
  message: string;
  type?: 'warning' | 'info';
  className?: string;
}

export const TokenExpirationAlert = ({ 
  message, 
  type = 'warning',
  className = '' 
}: TokenExpirationAlertProps) => {
  const isWarning = type === 'warning';
  
  return (
    <Card className={`${className} ${isWarning ? 'border-yellow-600/40' : 'border-blue-600/40'}`}>
      <CardBody className="p-3">
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 ${isWarning ? 'text-yellow-400' : 'text-blue-400'}`}>
            {isWarning ? <FiAlertTriangle size={20} /> : <FiInfo size={20} />}
          </div>
          <div className="flex-1">
            <Chip
              size="sm"
              className={`
                ${isWarning 
                  ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/40' 
                  : 'bg-blue-600/20 text-blue-300 border border-blue-600/40'
                }
              `}
            >
              {message}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}; 