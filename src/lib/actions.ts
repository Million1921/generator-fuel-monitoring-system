"use server"

import prisma from "@/lib/db"

export async function getFrequentSites() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const frequentSites = await prisma.workRequest.groupBy({
    by: ['siteId'],
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: 'COMPLETED',
    },
    _count: {
      id: true,
    },
    having: {
      id: { _count: { gt: 4 } }, // Flagged if more than 4 times/month
    },
  });
  
  return frequentSites;
}

export async function getAnalyticalReport() {
  const sites = await prisma.site.findMany({
    include: {
      generators: true,
      workRequests: {
        where: {
          status: 'COMPLETED'
        }
      }
    }
  });

  return sites.map(site => {
    const totalRefueled = site.workRequests.reduce((acc, req) => acc + (req.actualRefueled || 0), 0);
    const totalRunningHours = site.workRequests.reduce((acc, req) => acc + (req.totalRunningHour || 0), 0);
    const amountInBirr = site.workRequests.reduce((acc, req) => acc + ((req.actualRefueled || 0) * (req.unitPrice || 0)), 0);
    
    // Simple variance calculation based on standard consumption
    const expectedConsumption = site.generators.reduce((acc, gen) => acc + (gen.stdConsumption * totalRunningHours), 0);
    const variance = totalRefueled - expectedConsumption;

    return {
      siteNumber: site.siteNumber,
      location: site.location,
      totalRefueled,
      totalRunningHours,
      amountInBirr,
      variance
    };
  });
}
