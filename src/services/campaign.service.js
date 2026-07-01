import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export const campaignService = {
  async getTemplates(siteId) {
    return prisma.emailTemplate.findMany({
      where: { siteId },
      orderBy: { createdAt: "desc" }
    });
  },

  async createTemplate(siteId, data) {
    const { name, subject, htmlContent, designJson } = data;
    return prisma.emailTemplate.create({
      data: {
        siteId,
        name,
        subject,
        htmlContent,
        designJson,
      }
    });
  },

  async updateTemplate(siteId, id, data) {
    const { name, subject, htmlContent, designJson } = data;
    return prisma.emailTemplate.update({
      where: { id, siteId },
      data: {
        name,
        subject,
        htmlContent,
        designJson,
      }
    });
  },

  async deleteTemplate(siteId, id) {
    return prisma.emailTemplate.delete({
      where: { id, siteId }
    });
  },

  async getCampaigns(siteId) {
    return prisma.emailCampaign.findMany({
      where: { siteId },
      include: {
        list: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async createCampaign(siteId, data) {
    const { name, subject, body, listId, scheduledAt } = data;
    return prisma.emailCampaign.create({
      data: {
        siteId,
        name,
        subject,
        body,
        listId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? "scheduled" : "draft",
      }
    });
  },

  async deleteCampaign(siteId, id) {
    return prisma.emailCampaign.delete({
      where: { id, siteId }
    });
  },

  async sendTestEmail(siteId, campaignId, targetEmail) {
    const campaign = await prisma.emailCampaign.findFirst({
      where: { id: campaignId, siteId }
    });
    if (!campaign) throw new Error("Campaign not found");

    const settings = await prisma.globalSettings.findUnique({
      where: { siteId },
      select: { emailSettings: true }
    });

    const emailSettings = settings?.emailSettings || {};
    if (!emailSettings.smtpHost || !emailSettings.smtpUser) {
      throw new Error("SMTP settings not configured on this site");
    }

    const transporter = nodemailer.createTransport({
      host: emailSettings.smtpHost,
      port: Number(emailSettings.smtpPort || 587),
      secure: Number(emailSettings.smtpPort) === 465,
      auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPass,
      }
    });

    await transporter.sendMail({
      from: `"Global Backend" <${emailSettings.formEmail || emailSettings.smtpUser}>`,
      to: targetEmail,
      subject: `[TEST] ${campaign.subject}`,
      html: campaign.body
    });

    return { success: true };
  },

  async executeCampaign(siteId, campaignId) {
    const campaign = await prisma.emailCampaign.findFirst({
      where: { id: campaignId, siteId },
      include: {
        list: {
          include: {
            subscribers: {
              include: {
                subscriber: true
              }
            }
          }
        }
      }
    });
    if (!campaign) throw new Error("Campaign not found");
    if (!campaign.list) throw new Error("Campaign list not selected or empty");

    const settings = await prisma.globalSettings.findUnique({
      where: { siteId },
      select: { emailSettings: true }
    });

    const emailSettings = settings?.emailSettings || {};
    if (!emailSettings.smtpHost || !emailSettings.smtpUser) {
      throw new Error("SMTP credentials missing");
    }

    const transporter = nodemailer.createTransport({
      host: emailSettings.smtpHost,
      port: Number(emailSettings.smtpPort || 587),
      secure: Number(emailSettings.smtpPort) === 465,
      auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPass,
      }
    });

    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: "sending" }
    });

    const members = campaign.list.subscribers;
    let sentCount = 0;
    let failedCount = 0;

    for (const member of members) {
      const sub = member.subscriber;
      if (sub.status !== "active") continue;

      try {
        await transporter.sendMail({
          from: `"Global Backend" <${emailSettings.formEmail || emailSettings.smtpUser}>`,
          to: sub.email,
          subject: campaign.subject,
          html: campaign.body
        });

        await prisma.campaignLog.create({
          data: {
            campaignId,
            subscriberId: sub.id,
            status: "sent",
            sentAt: new Date()
          }
        });
        sentCount++;
      } catch (err) {
        await prisma.campaignLog.create({
          data: {
            campaignId,
            subscriberId: sub.id,
            status: "failed",
            errorMessage: err.message
          }
        });
        failedCount++;
      }
    }

    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: failedCount > 0 && sentCount === 0 ? "failed" : "sent",
        sentAt: new Date()
      }
    });

    return { success: true, sentCount, failedCount };
  }
};
