import { toast } from 'sonner';
import { Button } from '../components/ui/button';

export function notify(msg: string, id: string, code: number) {
  if (code !== 200) return toast.error(msg, { position: 'top-right', id });
  return toast.success(msg, { position: 'top-right', id });
}

export function toastConfirmAction(label: string, fn: any) {
  return toast('Make sure all fields are correct, you can’t edit them later', {
    position: 'top-center',
    id: 'confirm',
    duration: 10000,
    action: (
      <Button
        className="cursor-pointer"
        variant="outline"
        size="sm"
        onClick={fn}
      >
        {label}
      </Button>
    ),
  });
}
