-- CreateTable
CREATE TABLE "PageContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageSlug" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "navbarItemId" INTEGER,
    CONSTRAINT "PageContent_navbarItemId_fkey" FOREIGN KEY ("navbarItemId") REFERENCES "NavbarItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
