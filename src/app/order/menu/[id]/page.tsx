import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
} from "@mui/material";
import { prisma } from "@/libs/prisma";

interface Props {
  params: { id: string }; // For dynamic route parameter
  searchParams: { table: string }; // For query parameter
}




export default async function MenuDetailPage({ params, searchParams }: Props) {
  console.log(params, searchParams);
  const menu = await prisma.menus.findFirst({
    where: { id: Number(params.id) },
    include: {
      menuAddonCategories: true,
    },
  });
  const addOnCategoryIds = menu?.menuAddonCategories.map(
    (item) => item.addonCategoryId
  )

  const addOn = await prisma.addons.findMany({
    where: { addonCategoryId: { in: addOnCategoryIds } },
  })

  // console.log(menu);
  // console.log(addOn);

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <Card elevation={3}>
        <CardMedia
          component="img"
          height="300"
          image={menu?.imageUrl as string}
          alt={menu?.name}
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {menu?.name}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            helloo
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ฿{menu?.price}
          </Typography>
          <Divider sx={{ my: 2 }} />
          {/* {menu.addOnCategories.map((category) => (
            <Box key={category.id} mb={2}>
              <Typography variant="h6" gutterBottom>
                {category.name}
              </Typography>
              {category.addOns.map((addOn) => (
                <FormControlLabel
                  key={addOn.id}
                  control={<Checkbox />}
                  label={`${addOn.name} (+฿${addOn.price})`}
                />
              ))}
            </Box>
          ))} */}
          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            Add to cart
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
