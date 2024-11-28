
import { getCompanyId } from "@/libs/action";
import UpdateCompany from "./updateCompany";
import { prisma } from "@/libs/prisma";

export default async function Setting() {
    const companyId = await getCompanyId();
    const company = await prisma.company.findFirst({where: {id: companyId}});
  return (
      <UpdateCompany company={company} />
  );
}
