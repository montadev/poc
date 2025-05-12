<?php

namespace App\Controller;

use Sylius\Component\Core\Model\OrderInterface;
use Sylius\Component\Core\Model\ProductVariantInterface;
use Sylius\Component\Core\Repository\ProductVariantRepositoryInterface;
use Sylius\Component\Order\Context\CartContextInterface;
use Sylius\Component\Order\Modifier\OrderItemQuantityModifierInterface;
use Sylius\Component\Order\Processor\OrderProcessorInterface;
use Sylius\Resource\Factory\FactoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sylius\Component\Core\Repository\ProductRepositoryInterface;
use Sylius\Component\Core\Storage\CartStorageInterface;
use Sylius\Component\Channel\Context\ChannelContextInterface;
use Sylius\Bundle\CoreBundle\Factory\OrderFactoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Sylius\Component\Order\Model\OrderItemInterface;

class CartController extends AbstractController
{
    private CartContextInterface $cartContext;
    private FactoryInterface $orderItemFactory;
    private OrderItemQuantityModifierInterface $orderItemQuantityModifier;
    private ProductVariantRepositoryInterface $productVariantRepository;
    private OrderProcessorInterface $orderProcessor;

    public function __construct(
        CartContextInterface $cartContext,
        FactoryInterface $orderItemFactory,
        OrderItemQuantityModifierInterface $orderItemQuantityModifier,
        ProductVariantRepositoryInterface $productVariantRepository,
        OrderProcessorInterface $orderProcessor,
        ProductRepositoryInterface $productRepository,
        CartStorageInterface $cartSessionStorage,
        ChannelContextInterface $channelContextInterface,
        OrderFactoryInterface $OrderFactoryInterface
    ) {
        $this->cartContext = $cartContext;
        $this->orderItemFactory = $orderItemFactory;
        $this->orderItemQuantityModifier = $orderItemQuantityModifier;
        $this->productVariantRepository = $productVariantRepository;
        $this->orderProcessor = $orderProcessor;
        $this->productRepository = $productRepository;
        $this->cartSessionStorage = $cartSessionStorage;
        $this->channelContextInterface = $channelContextInterface;
        $this->OrderFactoryInterface = $OrderFactoryInterface;
       
    }

    #[Route('/cart/add', name: 'app_group_cart')]
    public function addToCart(Request $request,EntityManagerInterface $entityManager): Response
    {
   
        $channel = $this->channelContextInterface->getChannel();
        /** @var OrderInterface $cart */
        $cart = $this->cartContext->getCart();
       
      
        $productIds = explode(',',$request->query->get('groupeproduct'));
        
        if (is_array($productIds) && !empty($productIds)) {
            foreach ($productIds as $productId) {
                if(!empty($productId)){
                    dump($productId);
          
     
       
        $product = $this->productRepository->find($productId);
        $variants = $product->getVariants();
        $productVariant = $variants->first();
       
     
        if (null === $productVariant) {
            $this->addFlash('error', 'Le produit n\'existe pas.');
            return $this->redirectToRoute('sylius_shop_homepage');
        }
        
 
        $quantity = 1;
        $itemAlreadyInCart = false;

        // Parcours des éléments du panier pour voir si le variant est déjà là
        foreach ($cart->getItems() as $item) {
            if ($item->getVariant()->getCode() === $productVariant->getCode()) {
                // Le produit existe déjà -> on met à jour la quantité
                $this->orderItemQuantityModifier->modify($item, $item->getQuantity() + $quantity);
                $itemAlreadyInCart = true;
                break;
            }
        }

        if (!$itemAlreadyInCart) {
            // Sinon, on crée un nouvel item
            $orderItem = $this->orderItemFactory->createNew();
            $orderItem->setVariant($productVariant);
            $this->orderItemQuantityModifier->modify($orderItem, $quantity);
            $cart->addItem($orderItem);
            $entityManager->persist($orderItem);
        }


        // Traiter la commande (recalcul des prix, promotions, etc.)
        $this->orderProcessor->process($cart);

       
        $this->cartSessionStorage->setForChannel($channel,$cart);
    
        if (isset($orderItem)) {
            $entityManager->persist($orderItem);
        }

    }
}
}
        $entityManager->persist($cart);
        $entityManager->flush();
      
        return $this->redirectToRoute('sylius_shop_cart_summary');
    }

    #[Route('/{local}/cart/remove/{id}', name: 'app_remove_cart')]
    public function removeToCart(Request $request,EntityManagerInterface $entityManager, $id): Response
    {
        $channel = $this->channelContextInterface->getChannel();
        $cart = $this->cartContext->getCart();
      
        $orderItem = $entityManager->getRepository(OrderItemInterface::class)->find($id);
        $cart->removeItem($orderItem);
        $this->orderProcessor->process($cart);

        $this->cartSessionStorage->setForChannel($channel,$cart);
       
        $entityManager->persist($cart);
        $entityManager->flush();
        
        return $this->redirectToRoute('sylius_shop_cart_summary');

        
    }

    #[Route('/cart/add-update', name: 'app_group_cart_update')]
    public function addUpdateToCart(Request $request,EntityManagerInterface $entityManager): Response
    {
  
      
        $channel = $this->channelContextInterface->getChannel();
        /** @var OrderInterface $cart */
        $cart = $this->cartContext->getCart();
        $productId = $request->request->get('product');
        $quantity = $request->request->get('quantity');
       
      

        $product = $this->productRepository->find($productId);
        $variants = $product->getVariants();
        $productVariant = $variants->first();
       
     
        if (null === $productVariant) {
            $this->addFlash('error', 'Le produit n\'existe pas.');
            return $this->redirectToRoute('sylius_shop_homepage');
        }
        
 
        
        $itemAlreadyInCart = false;

        // Parcours des éléments du panier pour voir si le variant est déjà là
        foreach ($cart->getItems() as $item) {
            if ($item->getVariant()->getCode() === $productVariant->getCode()) {
                // Le produit existe déjà -> on met à jour la quantité
                $this->orderItemQuantityModifier->modify($item, $item->getQuantity() + $quantity);
                $itemAlreadyInCart = true;
                break;
            }
        }

        if (!$itemAlreadyInCart) {
            // Sinon, on crée un nouvel item
            $orderItem = $this->orderItemFactory->createNew();
            $orderItem->setVariant($productVariant);
            $this->orderItemQuantityModifier->modify($orderItem, $quantity);
            $cart->addItem($orderItem);
            $entityManager->persist($orderItem);
        }


        // Traiter la commande (recalcul des prix, promotions, etc.)
        $this->orderProcessor->process($cart);

       
        $this->cartSessionStorage->setForChannel($channel,$cart);
    
        if (isset($orderItem)) {
            $entityManager->persist($orderItem);
        }


        $entityManager->persist($cart);
        $entityManager->flush();
      
        return $this->redirectToRoute('sylius_shop_cart_summary');
    }

}