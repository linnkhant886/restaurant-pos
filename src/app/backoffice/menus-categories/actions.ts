'use server'

import { prisma } from "@/libs/prisma"
import exp from "constants"
import { redirect } from "next/navigation"

export async function CreateMenuCategory(formData :any) {
    const MenuCategory = formData.get('createMenuCategory')
    // console.log(formData)
    await prisma.menuCategories.create({
        data: {
            name: MenuCategory
        }
    })
    redirect ('/backoffice/menus-categories')
}


export async function UpdateMenuCategoryID(formData:any) {
    console.log(formData)
    const MenuCategoryId = formData.get('MenuCategoryId')
    const MenuCategoryName = formData.get('MenuCategoryName')
    await prisma.menuCategories.update({
        where: {
            id: Number(MenuCategoryId)
        },
        data: {
            name: MenuCategoryName
        }
    })
    redirect ('/backoffice/menus-categories')
}

export async function DeleteMenuCategoryID(formData:any) {
    // console.log(formData)
    const MenuCategoryId = formData.get('DeleteID')
    await prisma.menuCategories.delete({
        where: {
            id: Number(MenuCategoryId)
        }
    })
    redirect ('/backoffice/menus-categories')
}