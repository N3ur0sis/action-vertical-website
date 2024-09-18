-- CreateTable
CREATE TABLE "PageContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "PageContent_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "NavbarItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
