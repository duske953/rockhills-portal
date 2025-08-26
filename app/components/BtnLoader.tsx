import { MouseEventHandler } from 'react';
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
export default function BtnLoader({
  loading,
  action = 'Submit',
  disabled = false,
  onClick,
}: {
  loading: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  action?: string;
  disabled: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      className="cursor-pointer"
      type="submit"
      disabled={disabled}
    >
      {loading && <Loader2Icon className="animate-spin" />}
      {action}
    </Button>
  );
}
