import * as cdk from '@aws-cdk/core';
import {
  DualAlbFargateService
} from 'cdk-fargate-patterns';
import * as ecs from '@aws-cdk/aws-ecs';

export class ServerlessContainerDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props ? : cdk.StackProps) {
    super(scope, id, props);

    const mytask = new ecs.FargateTaskDefinition(this, 'Task', {
      cpu: 256,
      memoryLimitMiB: 512
    })
    mytask.addContainer('nyancat', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/pahudnet/nyancat-docker-image:latest'),
      portMappings: [{
        containerPort: 80,
      }]
    })

    new DualAlbFargateService(this, 'NyanCatService', {
      tasks: [{
        task: mytask,
        external: {
          port: 80
        }
      }],
      route53Ops: {
        enableLoadBalancerAlias: false,
      }
    })
  }
}