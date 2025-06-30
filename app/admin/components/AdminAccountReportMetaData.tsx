import ApproveAccountReport from './ApproveAccountReport';

export default function AdminAccountReportMetaData({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  return (
    <>
      <ApproveAccountReport id={id} approved={approved} />
    </>
  );
}
