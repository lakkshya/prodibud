const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const searchInboxMails = async (req, res) => {
  const userId = req.user.id;
  const search = req.query.query;

  try {
    const [recipientMails, ccMails, bccMails] = await Promise.all([
      prisma.recipient.findMany({
        where: { userId, isDraft: false, isDeleted: false },
        include: {
          email: {
            include: {
              sender: true,
            },
          },
        },
      }),

      prisma.cCRecipient.findMany({
        where: { userId, isDraft: false, isDeleted: false },
        include: {
          email: {
            include: {
              sender: true,
            },
          },
        },
      }),

      prisma.bCCRecipient.findMany({
        where: { userId, isDraft: false, isDeleted: false },
        include: {
          email: {
            include: {
              sender: true,
            },
          },
        },
      }),
    ]);

    // Combine
    let allInbox = [
      ...recipientMails.map((r) => r.email),
      ...ccMails.map((c) => c.email),
      ...bccMails.map((b) => b.email),
    ];

    // Deduplicate
    const seen = new Set();
    let uniqueInbox = allInbox.filter((mail) => {
      if (seen.has(mail.id)) return false;
      seen.add(mail.id);
      return true;
    });

    // 🔍 Apply search filter if present
    if (search) {
      const lower = search.toLowerCase();
      uniqueInbox = uniqueInbox.filter(
        (mail) =>
          mail.subject.toLowerCase().includes(lower) ||
          mail.body.toLowerCase().includes(lower) ||
          mail.sender.email.toLowerCase().includes(lower)
      );
    }

    // Sort
    uniqueInbox.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(uniqueInbox);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inbox" });
  }
};

const searchDraftMails = async (req, res) => {
  const userId = req.user.id;
  const search = req.query.query;

  try {
    let drafts = await prisma.email.findMany({
      where: {
        senderId: userId,
        isDraft: true,
        isDraftDeleted: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        cc: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        bcc: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    //search query filtering
    if (search) {
      const searchLower = search.toLowerCase();
      drafts = drafts.filter((mail) => {
        const inSubject = mail.subject?.toLowerCase().includes(searchLower);
        const inBody = mail.body?.toLowerCase().includes(searchLower);

        const inRecipients = (mail.recipients || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        const inCC = (mail.cc || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        const inBCC = (mail.bcc || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        return inSubject || inBody || inRecipients || inCC || inBCC;
      });
    }

    res.status(200).json(drafts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
};

const searchSentMails = async (req, res) => {
  const userId = req.user.id;
  const search = req.query.query;

  try {
    let sentEmails = await prisma.email.findMany({
      where: {
        senderId: userId,
        isDraft: false,
        isSentDeleted: false,
        isSentPermanentlyDeleted: false,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        cc: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        bcc: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    //search query filtering
    if (search) {
      const searchLower = search.toLowerCase();
      sentEmails = sentEmails.filter((mail) => {
        const inSubject = mail.subject?.toLowerCase().includes(searchLower);
        const inBody = mail.body?.toLowerCase().includes(searchLower);

        const inRecipients = (mail.recipients || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        const inCC = (mail.cc || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        const inBCC = (mail.bcc || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        return inSubject || inBody || inRecipients || inCC || inBCC;
      });
    }

    res.status(200).json(sentEmails);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch sent emails" });
  }
};

const searchTrashMails = async (req, res) => {
  const userId = req.user.id;
  const search = req.query.query;

  try {
    const [recipientTrash, ccTrash, bccTrash, draftTrash, sentTrash] =
      await Promise.all([
        //inbox recipients
        prisma.recipient.findMany({
          where: {
            userId,
            isDraft: false,
            isDeleted: true,
          },
          include: {
            email: {
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                recipients: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
                cc: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
                bcc: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),

        //inbox cc
        prisma.cCRecipient.findMany({
          where: {
            userId,
            isDraft: false,
            isDeleted: true,
          },
          include: {
            email: {
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                recipients: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
                cc: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
                bcc: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),

        //inbox bcc
        prisma.bCCRecipient.findMany({
          where: {
            userId,
            isDraft: false,
            isDeleted: true,
          },
          include: {
            email: {
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                recipients: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
                cc: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
                bcc: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),

        //draft
        prisma.email.findMany({
          where: {
            senderId: userId,
            isDraft: true,
            isDraftDeleted: true,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            recipients: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
            cc: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
            bcc: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
          },
        }),

        //sent
        prisma.email.findMany({
          where: {
            senderId: userId,
            isDraft: false,
            isSentDeleted: true,
            isSentPermanentlyDeleted: false,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            recipients: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
            cc: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
            bcc: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
          },
        }),
      ]);

    // Flatten
    let allTrash = [
      ...recipientTrash.map((r) => r.email),
      ...ccTrash.map((c) => c.email),
      ...bccTrash.map((b) => b.email),
      ...draftTrash,
      ...sentTrash,
    ];

    //search query filtering
    if (search) {
      const searchLower = search.toLowerCase();
      allTrash = allTrash.filter((mail) => {
        const inSubject = mail.subject?.toLowerCase().includes(searchLower);
        const inBody = mail.body?.toLowerCase().includes(searchLower);

        const inSender = mail.sender.email.toLowerCase().includes(searchLower);
        const inRecipients = (mail.recipients || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        const inCC = (mail.cc || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        const inBCC = (mail.bcc || []).some((r) =>
          r.user?.email?.toLowerCase().includes(searchLower)
        );

        return inSubject || inBody || inSender || inRecipients || inCC || inBCC;
      });
    }

    // Sort manually by updatedAt DESC
    allTrash.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.status(200).json(allTrash);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trash emails" });
  }
};

module.exports = {
  searchInboxMails,
  searchDraftMails,
  searchSentMails,
  searchTrashMails,
};
