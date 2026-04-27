import { getCompanyTables } from "@/lib/actions/action";
import { DeleteTable, UpdateTable } from "../actions";
import QrImage from "@/components/shared/QrImage";
import { SubmitButton } from "@/components/shared/SubmitButton";

export interface prop {
  params: { id: string };
}
export default async function UpdateTablePage({ params }: prop) {
  const { id } = params;
  const table = (await getCompanyTables()).find(
    (item) => item.id == Number(id)
  );
  const qrCodeUrl = table?.qrCodeImageUrl as string;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <form action={DeleteTable} className="flex justify-end">
        <SubmitButton 
          text="Delete" 
          variant="destructive" 
        />
        <input type="hidden" defaultValue={id} name="DeleteID" />
      </form>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center">
        <QrImage qrImageUrl={qrCodeUrl} />
      </div>

      <form action={UpdateTable} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Table Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Name"
            defaultValue={table?.name}
            name="name"
          />
        </div>
        
        <input type="hidden" name="id" value={id} />

        <div className="pt-2">
          <SubmitButton text="Update" />
        </div>
      </form>
    </div>
  );
}
