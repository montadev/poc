<?php

declare(strict_types=1);

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use App\DependencyInjection\Compiler\RemoveAddressedStateCompilerPass;
use Symfony\Component\DependencyInjection\Compiler\PassConfig;

final class Kernel extends BaseKernel
{
    use MicroKernelTrait;
    protected function build(ContainerBuilder $container): void
    {
        parent::build($container);
        
        // Ajoutez le CompilerPass avec une priorité appropriée
        $container->addCompilerPass(
            new RemoveAddressedStateCompilerPass(),
            PassConfig::TYPE_BEFORE_OPTIMIZATION,
            -5
        );
    }
}
