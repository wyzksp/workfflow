import {Ticker} from 'argo-ui';
import * as React from 'react';

import {labels, NODE_PHASE, Workflow} from '../../../models';
import {uiUrl} from '../../shared/base';
import {DurationPanel} from '../../shared/components/duration-panel';
import {Phase} from '../../shared/components/phase';
import {Timestamp} from '../../shared/components/timestamp';
import {ConditionsPanel} from '../../shared/conditions-panel';
import {Consumer} from '../../shared/context';
import {wfDuration} from '../../shared/duration';
import {ResourcesDuration} from '../../shared/resources-duration';
import {WorkflowFrom} from './workflow-from';
import {WorkflowLabels} from './workflow-labels/workflow-labels';

export const WorkflowSummaryPanel = (props: {workflow: Workflow}) => (
    <Ticker disabled={props.workflow && props.workflow.status.phase !== NODE_PHASE.RUNNING}>
        {() => {
            const attributes: {title: string; value: any}[] = [
                {title: '状态', value: <Phase value={props.workflow.status.phase} />},
                {title: '信息', value: props.workflow.status.message},
                {title: '名称', value: props.workflow.metadata.name},
                {title: '命名空间', value: props.workflow.metadata.namespace},
                {title: '来源', value: <WorkflowFrom namespace={props.workflow.metadata.namespace} labels={props.workflow.metadata.labels} />},
                {
                    title: '标签',
                    value: (
                        <Consumer>
                            {ctx => (
                                <WorkflowLabels
                                    workflow={props.workflow}
                                    onChange={(key, value) => ctx.navigation.goto(uiUrl(`workflows/${props.workflow.metadata.namespace}?label=${key}=${value}`))}
                                />
                            )}
                        </Consumer>
                    )
                },
                {title: '开始时间', value: <Timestamp date={props.workflow.status.startedAt} />},
                {title: '结束时间 ', value: <Timestamp date={props.workflow.status.finishedAt} />},
                {
                    title: '持续时间',
                    value: (
                        <DurationPanel
                            phase={props.workflow.status.phase}
                            duration={wfDuration(props.workflow.status)}
                            estimatedDuration={props.workflow.status.estimatedDuration}
                        />
                    )
                },
                {title: '进展', value: props.workflow.status.progress || '-'}
            ];
            const creator = props.workflow.metadata.labels[labels.creator];
            if (creator) {
                attributes.push({title: 'Creator', value: creator});
            }
            if (props.workflow.status.resourcesDuration) {
                attributes.push({
                    title: '资源需求',
                    value: <ResourcesDuration resourcesDuration={props.workflow.status.resourcesDuration} />
                });
            }
            if (props.workflow.status.conditions) {
                attributes.push({
                    title: '状态',
                    value: <ConditionsPanel conditions={props.workflow.status.conditions} />
                });
            }
            return (
                <div className='white-box'>
                    <div className='white-box__details'>
                        {attributes.map(attr => (
                            <div className='row white-box__details-row' key={attr.title}>
                                <div className='columns small-3'>{attr.title}</div>
                                <div className='columns small-9'>{attr.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }}
    </Ticker>
);
