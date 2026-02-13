import { Report, ReportStatus } from "@prisma/client";

export class ReportStatusDomainService {
  static canAcknowledge(report:Report, userId: string) {
    return report.status === ReportStatus.OPEN && report.creatorId !== userId;
  }

  static canStartProgress(report:Report, userId: string) {
    return report.status === ReportStatus.ACKNOWLEDGED && report.creatorId === userId;
  }

  static canRequestClose(report:Report, userId: string) {
    return report.status === ReportStatus.IN_PROGRESS && report.creatorId === userId;
  }
}
