import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
export default function BtnLoader({
  loading,
  action = 'Submit',
  disabled = false,
}: {
  loading: boolean;
  action?: string;
  disabled: boolean;
}) {
  return (
    <Button className="cursor-pointer" type="submit" disabled={disabled}>
      {loading && <Loader2Icon className="animate-spin" />}
      {action}
    </Button>
  );
}
