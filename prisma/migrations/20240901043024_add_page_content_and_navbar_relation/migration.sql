-- CreateTable
CREATE TABLE "_PageContentToNavbar" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PageContentToNavbar_A_fkey" FOREIGN KEY ("A") REFERENCES "NavbarItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PageContentToNavbar_B_fkey" FOREIGN KEY ("B") REFERENCES "PageContent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PageContentToNavbar_AB_unique" ON "_PageContentToNavbar"("A", "B");

-- CreateIndex
CREATE INDEX "_PageContentToNavbar_B_index" ON "_PageContentToNavbar"("B");

-- CreateIndex
CREATE INDEX "NavbarItem_parentId_idx" ON "NavbarItem"("parentId");

-- RedefineIndex
DROP INDEX "pageId_idx";
CREATE INDEX "PageContent_pageId_idx" ON "PageContent"("pageId");
