
import { getCompanyId } from "@/lib/actions/action";
import UpdateCompany from "./updateCompany";
import { prisma } from "@/lib/prisma";

export default async function Setting() {
    const companyId = await getCompanyId();
    const company = await prisma.company.findFirst({where: {id: companyId}});
  return (
      <UpdateCompany company={company} />
  );
}

