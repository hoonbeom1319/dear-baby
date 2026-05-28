'use client';

import { Fragment } from 'react';

import { useRouter } from 'next/navigation';

import { useApp } from '@/application/providers';

import type { Course } from '@/entities/course';

import { useCatalog } from '@/shared/lib';
import { AppHeader, Card, Icon, IconButton, MobileShell } from '@/shared/ui';

const Dot = () => <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />;

type Props = { allCourses: Course[] };

/**
 * 코스 목록 (PRD F-9). 마지막으로 본 동네의 코스 카드만 나열한다.
 * 코스는 큐레이터가 직접 묶은 것 — 자동 생성하지 않는다.
 */
export const CourseList = ({ allCourses }: Props) => {
    const router = useRouter();
    const { area, getPlaceById } = useApp();
    const { getArea } = useCatalog();

    const courses = allCourses.filter((c) => c.area === area);
    const areaName = getArea(area)?.name;

    return (
        <MobileShell>
            <AppHeader
                left={<IconButton name="back" onClick={() => router.push('/')} />}
                title={`${areaName} 추천 코스`}
                subtitle={`${courses.length}개의 외출 시퀀스`}
            />

            <div className="flex flex-1 flex-col gap-3 px-4 pb-10 pt-3">
                {courses.map((course) => (
                    <Card key={course.id} interactive onClick={() => router.push(`/course/${course.id}`)} className="p-3.5">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <div className="text-[15px] font-semibold leading-snug tracking-[-0.005em] text-surface-foreground">
                                    {course.title}
                                </div>
                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                                    <span>정거장 {course.stopIds.length}곳</span>
                                    <Dot />
                                    <span className="inline-flex items-center gap-1">
                                        <Icon name="clock" size={11} stroke={2} /> {course.duration}
                                    </span>
                                    <Dot />
                                    <span>{course.season}</span>
                                </div>
                            </div>
                            <Icon name="right" size={18} className="text-slate-400" />
                        </div>
                        <p className="mt-2.5 text-[13px] leading-normal text-slate-700">{course.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {course.stopIds.map((id, idx) => (
                                <Fragment key={id}>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-[3px] text-[11px] font-medium text-surface-foreground">
                                        {idx + 1}. {getPlaceById(id)?.name.split(' ')[0]}
                                    </span>
                                    {idx < course.stopIds.length - 1 && <span className="text-[11px] text-slate-400">→</span>}
                                </Fragment>
                            ))}
                        </div>
                    </Card>
                ))}

                {courses.length === 0 && (
                    <div className="flex flex-col items-center gap-3 px-8 pt-16 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                            <Icon name="map" size={28} stroke={2} />
                        </div>
                        <div className="text-[15px] font-semibold text-surface-foreground">아직 등록된 코스가 없어요</div>
                        <div className="text-[13px] text-muted">이 동네는 곧 큐레이션 예정이에요</div>
                    </div>
                )}
            </div>
        </MobileShell>
    );
};
