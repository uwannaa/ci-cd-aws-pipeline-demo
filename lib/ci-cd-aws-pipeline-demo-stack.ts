import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";

import { ManualApprovalStep } from "aws-cdk-lib/pipelines";
import { MyPipelineAppStage } from './stage';
import * as cdk from "aws-cdk-lib";

export class CiCdAwsPipelineDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline =new CodePipeline(this, "Pipeline", {
      pipelineName: "TestPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub(
          "uwannaa/ci-cd-aws-pipeline-demo",
          "main",
        ),
        commands: ["npm ci", "npm run build", "npm cdk synth"],
      }),
    });

    const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      }
    }));

    testingStage.addPost(new ManualApprovalStep("Manual approval before production"));

    const productionStage = pipeline.addStage(new MyPipelineAppStage (this, "prod", {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      }
      }));
    }
}
